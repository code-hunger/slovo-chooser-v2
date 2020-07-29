<script>
    import ChunkEditor from "./ChunkEditor.svelte"
    import SavedWordsContainer from "./SavedWordsHistory.svelte"
    import TextAdder from "./TextAdder.svelte"
    import TextSourceSelect from "./TextSourceSelect.svelte"
    import exportToCsv from "./exportToCSV.js"
    import { persistSavedWords, retrieveSavedWords, savedWordDeleterCreator, textDeleterCreator, switchChunkCreator, persistTexts, onSaveChunkCreator, downloadSavedWords, exportState } from "./utils.js"
    import md5 from "md5";
    import _ from "lodash"

    let texts = JSON.parse(localStorage.getItem("texts") || '[]') // No Maybe in JS :(

    let showTextAdder = texts.length == 0;

    let currentlyEditing = {
        textId: null,
        chunk: null,
        word: null
    }

    $: savedChunks = currentlyEditing.textId != null && retrieveSavedWords(texts[currentlyEditing.textId][0]) || {};

    $: initial = currentlyEditing.chunk != null && currentlyEditing.word != null
        ? savedChunks[currentlyEditing.chunk][currentlyEditing.word]
        : null

    function onCancelEdit() {
        if(confirm("Cancel edit?"))
            currentlyEditing.word = null;
    }

    function selectSavedWord({ detail }) {
        if(currentlyEditing.chunk == detail.chunk && currentlyEditing.word == detail.word) {
            alert("You're currently editing this word.");
            return;
        }

        if(currentlyEditing.chunk != null && currentlyEditing.word != null) {
            if(!confirm("You're currently editing '" + initial.input + "'. Discard?")) {
                return;
            }
        }

        // `detail.chunk` comes as a key from savedChunks and hence is a String,
        // which makes further integer operations behave badly ('14' + 1 = 141 :/)
        currentlyEditing.chunk = parseInt(detail.chunk);
        currentlyEditing.word = detail.word;
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

        if(currentlyEditing.word != null) {
            alert("A word is currently being edited!")
            return
        }

        currentlyEditing.textId = i;
        currentlyEditing.chunk = parseInt(texts[i][2] || 0);
    }

    function savedChunksUpdater(chunk, newValue) {
        savedChunks[chunk] = newValue;
        persistSavedWords(texts[currentlyEditing.textId][0], savedChunks);
    }
    function currentSavedChunksUpdater(newValue) {
        savedChunksUpdater(currentlyEditing.chunk, newValue);
    }

    function currentChunkIdUpdater(newChunkId) {
        if(typeof newChunkId !== "number") { alert("Internall type error!") }
        currentlyEditing.chunk = newChunkId;
        texts[currentlyEditing.textId][2] = newChunkId;
        persistTexts(texts);
    }

    function resetCurrentlyEditing() {
        currentlyEditing = { textId: null, chunk: null, word: null }
    }
    function resetCurrentWord() { currentlyEditing.word = null; }

    function textsUpdater(newTexts) {
        texts = newTexts;
        persistTexts(texts);
    }

    const textDeleter = textDeleterCreator(resetCurrentlyEditing, textsUpdater);
    const savedWordDeleter = savedWordDeleterCreator(savedChunksUpdater, resetCurrentWord);
    const switchChunk = switchChunkCreator(currentChunkIdUpdater);
    const onSaveChunk = onSaveChunkCreator(resetCurrentWord, currentSavedChunksUpdater);
    const download = () => downloadSavedWords(texts[currentlyEditing.textId][0], savedChunks)
</script>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css">

<style>
    .grid { border: 1px solid black; }
    a { display: block; }
</style>

<div class="ui stackable grid container">
    <div class="three wide column">
        <a href='#' on:click|preventDefault={download}>Export to CSV</a>
        <a href='#' on:click|preventDefault={exportState}>Export whole state</a>
        {#if !showTextAdder}
            <a href='#' on:click|preventDefault={() => showTextAdder = true}>
                Add a new text source
            </a>
        {/if}

        <TextSourceSelect currentId={currentlyEditing.textId} {texts}
                          on:select={({ detail }) => selectText(detail)}
                          on:delete={textDeleter(currentlyEditing.textId, texts)} />

        <div class="centered column row">
            <SavedWordsContainer chunks={savedChunks}
                                 activeChunk={currentlyEditing.chunk}
                                 activeWord={currentlyEditing.word}
                                 on:select={selectSavedWord}
                                 on:delete={savedWordDeleter(currentlyEditing.chunk, currentlyEditing.word, savedChunks)}/>
        </div>
    </div>

    <div class="thirteen wide column">
        {#if showTextAdder}
            <div class="one column row">
                <TextAdder on:textAdded={addText} on:cancelEdit={() => showTextAdder = false} />
            </div>
        {/if}

        <div class="row">
            {#if currentlyEditing.textId != null}
                <ChunkEditor chunkText={texts[currentlyEditing.textId][1][currentlyEditing.chunk]}
                             {initial}

                             on:requestCancelEdit={onCancelEdit}
                             on:saveChunk={onSaveChunk(currentlyEditing.word, savedChunks[currentlyEditing.chunk])}
                             on:changeChunk={switchChunk(currentlyEditing.chunk, currentlyEditing.word, texts[currentlyEditing.textId])}/>
            {:else}
                No text.
            {/if}
        </div>

    </div>
</div>

