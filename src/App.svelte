<script>
    import ChunkEditor from "./ChunkEditor.svelte"
    import SavedWordsContainer from "./SavedWordsHistory.svelte"
    import TextAdder from "./TextAdder.svelte"
    import TextSourceSelect from "./TextSourceSelect.svelte"
    import MarkedWordsList from "./MarkedWordsList.svelte"
    import allMarked from "./markedWords.js"
    import { persistSavedWords, retrieveSavedWords, savedWordDeleterCreator, textDeleterCreator, switchChunkCreator, persistTexts, onSaveChunkCreator, downloadSavedWords, exportState } from "./utils.js"
    import _ from "lodash"

    let texts = JSON.parse(localStorage.getItem("texts") || '[]') // No Maybe in JS :(

    let showTextAdder = texts.length == 0;

    let activeWord = null, activeChunk = null, activeTextId = null;

    $: sendMarkedToStore(currentMarked)
    $: currentMarked = recalcCurrentMarked(activeTextId, activeChunk);

    const emptyMarked = [];
    function recalcCurrentMarked (text, chunk) {
        console.log("Recalc marked");
        return ($allMarked[text] && $allMarked[text][chunk]) || emptyMarked;
    }

    function sendMarkedToStore(marked) {
        console.log("Saving marked words!", marked)
        allMarked.updateCurrent(activeTextId, activeChunk, marked);
    }

    $: savedChunks = activeTextId != null && retrieveSavedWords(texts[activeTextId][0]) || {};

    $: initial = activeChunk != null && activeWord != null
        ? savedChunks[activeChunk][activeWord]
        : null

    function onCancelEdit() {
        if(confirm("Cancel edit?"))
            activeWord = null;
    }

    function selectSavedWord({ detail }) {
        if(activeChunk == detail.chunk && activeWord == detail.word) {
            alert("You're currently editing this word.");
            return;
        }

        if(activeChunk != null && activeWord != null) {
            if(!confirm("You're currently editing '" + initial.input + "'. Discard?")) {
                return;
            }
        }

        // `detail.chunk` comes as a key from savedChunks and hence is a String,
        // which makes further integer operations behave badly ('14' + 1 = 141 :/)
        activeChunk = parseInt(detail.chunk);
        activeWord = detail.word;
    }

    function addText({ detail: { title, lines } }) {
        if(_.find(texts, o => o[0] == title)) {
            alert("There is already a text with this title!");
            return;
        }

        textsUpdater([...texts, [title, lines, 0]]);

        showTextAdder = false;
    }

    function selectText(i) {
        if(!Number.isFinite(i)) {
            alert("The selected 'thing' is not an id of a text: ", i);
            console.log("This is not an id of a text: ", i);
            return;
        }

        if(activeWord != null) {
            alert("A word is currently being edited!")
            return
        }

        activeTextId = i;
        activeChunk = parseInt(texts[i][2] || 0);
    }

    function savedChunksUpdater(chunk, newValue) {
        savedChunks[chunk] = newValue;
        persistSavedWords(texts[activeTextId][0], savedChunks);
    }
    function currentSavedChunksUpdater(newValue) {
        savedChunksUpdater(activeChunk, newValue);
    }

    function currentChunkIdUpdater(newChunkId) {
        if(typeof newChunkId !== "number") { alert("Internall type error!") }
        activeChunk = newChunkId;
        texts[activeTextId][2] = newChunkId;
        persistTexts(texts);
    }

    function resetCurrentlyEditing() { activeChunk = activeWord = activeTextId = null; }
    function resetCurrentWord() { activeWord = null; }

    function textsUpdater(newTexts) {
        texts = newTexts;
        persistTexts(texts);
    }

    function markedWordsCurrentCleaner(textId) { $allMarked = {...$allMarked, [textId]: undefined}; }

    const textDeleter = textDeleterCreator(resetCurrentlyEditing, textsUpdater, markedWordsCurrentCleaner);
    const savedWordDeleter = savedWordDeleterCreator(savedChunksUpdater, resetCurrentWord);
    const switchChunk = switchChunkCreator(currentChunkIdUpdater);
    const onSaveChunk = onSaveChunkCreator(resetCurrentWord, currentSavedChunksUpdater);
    const download = () => downloadSavedWords(texts[activeTextId][0], savedChunks)
</script>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css">

<style>
    .grid { border: 1px solid black; }
    .link-button { color: cornflowerblue; background: inherit; border: none; cursor: pointer; }
    .block { display: block; }
    .main-page-actions button { margin-top: 1ex; }
</style>

<div class="ui stackable grid container">
    <div class="three wide column">
        <div class="ui list main-page-actions">
            {#if !showTextAdder}
                <button class="fluid ui item compact labeled icon small button block" on:click={() => showTextAdder = true}>
                    <i class="circle plus icon"></i>
                    Add text
                </button>
            {/if}

            {#if activeTextId != null}
                <button class="fluid ui item compact labeled icon small button block" on:click={download}>
                    <i class="download icon"></i>
                    Export to csv
                </button>
            {/if}

            {#if window.location.hash.indexOf("state") != -1}
                <!-- One probably wont need this so let's hide it by default -->
                <button class="item link-button block" on:click={exportState}>Export whole state</button>
            {/if}
        </div>

        <TextSourceSelect currentId={activeTextId} {texts}
                          on:select={({ detail }) => selectText(detail)}
                          on:delete={textDeleter(activeTextId, texts)} />

        <div class="centered column row">
            <MarkedWordsList marked={$allMarked[activeTextId]} on:selectChunk={e => currentChunkIdUpdater(parseInt(e.detail))} />
        </div>

        <div class="centered column row">
            <SavedWordsContainer chunks={savedChunks}
                                 activeChunk={activeChunk}
                                 activeWord={activeWord}
                                 on:select={selectSavedWord}
                                 on:delete={savedWordDeleter(activeChunk, activeWord, savedChunks)}/>
        </div>
    </div>

    <div class="thirteen wide column">
        {#if showTextAdder}
            <div class="one column row">
                <TextAdder on:textAdded={addText} on:cancelEdit={() => showTextAdder = false} />
            </div>
        {/if}

        <div class="row">
            {#if activeTextId != null}
                <ChunkEditor chunkText={texts[activeTextId][1][activeChunk]}
                             {initial}

                             bind:markedStrings={currentMarked}

                             on:requestCancelEdit={onCancelEdit}
                             on:saveChunk={onSaveChunk(activeWord, savedChunks[activeChunk])}
                             on:changeChunk={switchChunk(activeChunk, activeWord, texts[activeTextId])}/>
            {:else}
                No text.
            {/if}
        </div>

    </div>
</div>

