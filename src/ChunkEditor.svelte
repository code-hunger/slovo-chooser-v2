<script>
    import WordCollector from "./WordCollector.svelte";
    import DictionaryView from "./DictionaryView.svelte"
    import InputSearchWord from "./InputSearchWord.svelte"
    import update from "immutability-helper"
    import { tick, createEventDispatcher } from 'svelte';
    import { arrayToggle, wordToggleMark, wordUnmark, containsWord, smartToggleSubstring, smartRemoveFromString, trimPunctuation, emphasizeWordInStr, inferEnteredFromInput, updateMarkedFromInput, immutableSplice } from "./utils.js"
    import ContextStrategyChooser from "./ContextStrategyChooser.svelte";
    import _ from "lodash"

	import { slide } from 'svelte/transition';

    export let chunkText, markedStrings, initial = { input: '', translation: '', context: '' };

    const dispatch = createEventDispatcher();

    $: words = chunkText
        .split(/[\s–]+/)
        .filter(w => trimPunctuation(w) != '')
        .map(w => ({ word: w, marked: markedStrings.indexOf(w) != -1 }));

    $: inputValue = (chunkText, initial && initial.input || '');
    $: translationValue = (chunkText, initial && initial.translation || '');

    $: selectedMarked = markedStrings.map(w => containsWord(inputValue, w));
    $: dictionaryWord = (chunkText, '');

    $: showContextSelector = showContextSelector || (inputValue && translationValue);

    let selectedContext = '';

    const saveConditions = [
        [ () => inputValue != '' , 'No input entered!' ],
        [ () => inputValue == dictionaryWord , 'input value not equal to translation value!' ],
        [ () => translationValue != '', 'no translation entered' ]
    ]

    function toggleUnknown(i, word) {
        if(words[i].marked)
            inputValue = smartRemoveFromString(inputValue, word)
        else
            if(trimPunctuation(inputValue) == "")
                inputValue = word;

        words[i] = wordToggleMark(words[i]);

        const indexOfMarked = markedStrings.indexOf(word);

        markedStrings = indexOfMarked == -1
            ?  [...markedStrings, word] // if not marked - mark
            : immutableSplice(markedStrings, indexOfMarked); // otherwise - unmark
    }

    function toggleEntered(word) {
        inputValue = smartToggleSubstring(inputValue, word);
    }

    function applySearch() { dictionaryWord = inputValue }

    function checkSubmitConditions() {
        for(let cond of saveConditions)
            if(!(cond[0]()))
                return cond[1];

        return false;
    }

    function submit() {
        let err = checkSubmitConditions();
        if(err) {
            alert(err);
            return;
        }

        dispatch("saveChunk", {
            input: inputValue,
            translation: translationValue,
            context: emphasizeWordInStr(selectedContext, inputValue)
        });

        inputValue = ''
        dictionaryWord = ''
        translationValue = ''
        showContextSelector = false;
    }

    function switchChunk(dir) {
        dir = dir > 0 ? 1 : -1;
        inputValue = ''
        dictionaryWord = ''
        translationValue = ''
        dispatch("changeChunk", dir);
        showContextSelector = false;
    }

    function goPrev() { switchChunk(-1); }
    function goNext() { switchChunk(1); }

    async function cancelEdit() {
        dispatch("requestCancelEdit");
        await tick();
        showContextSelector = false;
    }

    function fireCombo(key, altKey) {
        if(altKey && key == 'n')
            switchChunk(1);
        if(altKey && key == 'p')
            switchChunk(-1);
    }
</script>

<style>
    .row, .column { background: #F9FbFb; }
    .form .translation {}
</style>

<svelte:window on:keydown={({ key, altKey }) => fireCombo(key, altKey)} />

<div class="ui form">
<div class="ui stackable celled grid">
    <div class="sixteen wide tablet ten wide computer column">
        <h3 class="ui header">Your text</h3>
        <WordCollector words={words} markedClass="unknown" on:wordClick={e => toggleUnknown(e.detail.i, e.detail.word.word)} />
    </div>
    <div class="sixteen wide tablet six wide computer column">
        <h3 class="ui header">Marked words</h3>
        <WordCollector
            words={_.zip(markedStrings, selectedMarked).map(([word, marked]) => ({ word, marked }))}
            markedClass="entered"
            on:wordClick={e => toggleEntered(e.detail.word.word)} />

        <div class="segment">
            <InputSearchWord bind:inputValue initialInput={initial && initial.input} on:applySearch={applySearch} wasSearched={inputValue == dictionaryWord} />
        </div>
    </div>

    <div class="sixteen wide column row">
        <DictionaryView searchTerm={dictionaryWord} />
    </div>

    <div class="row">
        <div class="sixteen wide column">
            <div class="field">
                <label> Select meaning:</label>
                <div class="ui icon input fluid">
                    <textarea class="translation"
                              type="text"
                              rows=2
                              placeholder="Meaning"
                              bind:value={translationValue} />
                        <i class="close link icon" on:click={() => translationValue=''} />
                </div>
            </div>
        </div>
    </div>

    <!-- No need to show the context selector before selecting a word and a translation -->
    {#if showContextSelector}
        <div class="column row" transition:slide={{delay: 1000}}>
            <ContextStrategyChooser words={words} initialContext={initial && initial.context} bind:selectedContext />
        </div>
    {/if}

    <div class="column row centered">
        {#if initial && initial.input}
            <button class="ui button" on:click={submit}>Update it!</button>
            <button class="ui button" on:click={cancelEdit}>Cancel editing "{initial.input}"</button>
        {:else}
            <button class="ui button" on:click={goPrev}>«</button>
            <button class="ui button" on:click={submit}>Add word</button>
            <button class="ui button" on:click={goNext}>»</button>
        {/if}
    </div>
</div>
</div>
