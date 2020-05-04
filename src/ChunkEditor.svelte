<script>
    import WordCollector from "./WordCollector.svelte";
    import DictionaryView from "./DictionaryView.svelte"
    import update from "immutability-helper"
    import { tick, createEventDispatcher } from 'svelte';
    import { arrayToggle, wordToggleMark, wordUnmark, containsWord, smartToggleSubstring, smartRemoveFromString, trimPunctuation, emphasizeWordInStr, inferEnteredFromInput, updateMarkedFromInput } from "./utils.js"
    import ContextStrategyChooser from "./ContextStrategyChooser.svelte";
    import _ from "lodash"

    export let chunkText, initialInput = null, initialTranslation = null;

    const dispatch = createEventDispatcher();

    $: words = chunkText
        .split(/[\s–]+/)
        .filter(w => trimPunctuation(w) != '')
        .map(w => ({ word: w, marked: false  }));

    $: inputValue = (chunkText, initialInput || '');
    $: translationValue = (chunkText, initialTranslation || '');

    $: marked = (chunkText, []);
    $: dictionaryWord = (chunkText, '');

    const saveConditions = [
        [ () => inputValue != '' , 'No input entered!' ],
        [ () => inputValue == dictionaryWord , 'input value not equal to translation value!' ],
        [ () => translationValue != '', 'no translation entered' ]
    ]

    function toggleUnknown({ detail }) {
        if(words[detail.i].marked)
            inputValue = smartRemoveFromString(inputValue, detail.word.word)
        else
            if(trimPunctuation(inputValue) == "")
                inputValue = detail.word.word;

        words[detail.i] = wordToggleMark(words[detail.i]);
        marked = arrayToggle(marked, wordUnmark(words[detail.i]));
        marked = updateMarkedFromInput(marked, inputValue);
    }

    function toggleEntered({ detail: { word } }) {
        inputValue = smartToggleSubstring(inputValue, word.word);
        marked = updateMarkedFromInput(marked, inputValue);
    }

    function inputKeyup({ target }) {
        marked = updateMarkedFromInput(marked, inputValue);
    }

    function applySearch() {
        inputValue = trimPunctuation(inputValue);
        dictionaryWord = inputValue
    }

    function clearInput() {
        inputValue = '';
    }

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
            context: emphasizeWordInStr(chunkText, inputValue)
        });

        inputValue = ''
        dictionaryWord = ''
        translationValue = ''
    }

    function switchChunk(dir) {
        dir = dir > 0 ? 1 : -1;
        inputValue = ''
        dictionaryWord = ''
        translationValue = ''
        dispatch("changeChunk", dir);
    }

    function goPrev() { switchChunk(-1); }
    function goNext() { switchChunk(1); }

    async function cancelEdit() {
        dispatch("requestCancelEdit");
        await tick();
        marked = updateMarkedFromInput(marked, inputValue);
    }

    function fireCombo(key, altKey) {
        if(altKey && key == 'n')
            switchChunk(1);
        if(altKey && key == 'p')
            switchChunk(-1);
    }

</script>

<style>
    .column { background: #F9FbFb; }
    .form .translation {}
</style>

<svelte:window on:keydown={({ key, altKey }) => fireCombo(key, altKey)} />

<div class="ui form">
<div class="ui stackable celled grid">
    <div class="sixteen wide tablet eleven wide computer column">
        <h3 class="ui header">Your text</h3>
        <WordCollector words={words} markedClass="unknown" on:wordClick={toggleUnknown} />
    </div>
    <div class="sixteen wide tablet five wide computer column">
        <h3 class="ui header">Marked words</h3>
        <WordCollector words={marked} markedClass="entered" on:wordClick={toggleEntered} />

        <div class="segment">
            {#if initialInput}
                <label>Currently editing: <i>{initialInput}</i></label>
            {/if}
            <div class="ui action icon input">
                <input type="text"
                       placeholder="Search words"
                       bind:value={inputValue}
                       on:keyup={inputKeyup}
                       on:keydown={e => {if(e.keyCode == 13) applySearch()}} />
                       <i class="close link icon" on:click={clearInput}></i>
                       <button class="ui icon button" on:click={applySearch}>
                           <i class="search icon" />
                       </button>
            </div>
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

    <div class="row">
        <div class="sixteen wide column">
            <ContextStrategyChooser words={words} />
        </div>
    </div>

    <div class="column row centered">
        {#if initialInput}
            <button class="ui button" on:click={submit}>Update it!</button>
            <button class="ui button" on:click={cancelEdit}>Cancel editing "{initialInput}"</button>
        {:else}
            <button class="ui button" on:click={goPrev}>«</button>
            <button class="ui button" on:click={submit}>Add word</button>
            <button class="ui button" on:click={goNext}>»</button>
        {/if}
    </div>
</div>
</div>
