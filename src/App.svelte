<script>
    import ChunkEditor from "./ChunkEditor.svelte"
    import SavedWordsContainer from "./SavedWordsHistory.svelte"
    import TextAdder from "./TextAdder.svelte"
    import exportToCsv from "./exportToCSV.js"
    import { persistSavedWords, retrieveSavedWords } from "./utils.js"
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

    $: initialInput = currentlyEditing.chunk != null && currentlyEditing.word != null
        ? savedChunks[currentlyEditing.chunk][currentlyEditing.word].input
        : null
    $: initialTranslation = currentlyEditing.chunk != null && currentlyEditing.word != null
        ? savedChunks[currentlyEditing.chunk][currentlyEditing.word].translation
        : null

    function onSaveChunk({ detail }) {
        const chunkId = currentlyEditing.chunk;

        if(!savedChunks[chunkId])
            savedChunks[chunkId] = [];

        if(currentlyEditing.word == null) {
            savedChunks[chunkId] = [...savedChunks[chunkId], detail];
        } else {
            savedChunks[chunkId][currentlyEditing.word] = detail;
            currentlyEditing.word = null;
        }

        console.log("before:",savedChunks);
        persistSavedWords(texts[currentlyEditing.textId][0], savedChunks);
        console.log(savedChunks);
    }

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
            if(!confirm("You're currently editing '" + initialInput + "'. Discard?")) {
                return;
            }
        }

        currentlyEditing.chunk = detail.chunk;
        currentlyEditing.word = detail.word;
    }

    function download() {
        const csvArray = _.flatMap(savedChunks).map(_.values);

        if(!csvArray.length) {
            alert("No saved chunks!");
            return;
        }

        exportToCsv(texts[currentlyEditing.textId][0] + ".csv", csvArray);
    }

    function persistTexts(texts) {
        localStorage.setItem("texts", JSON.stringify(texts));
    }

    function addText({ detail: { title, lines } }) {
        if(_.find(texts, o => o[0] == title)) {
            alert("There is already a text with this title!");
            return;
        }

        texts = [...texts, [title, lines, 0]];
        persistTexts(texts);

        showTextAdder = false;
    }

    function selectText(i) {
        if(currentlyEditing.word != null) {
            alert("A word is currently being edited!")
            return
        }

        currentlyEditing.textId = i;
        currentlyEditing.chunk = texts[i][2] || 0;
    }

    function switchChunk(dir) {
        dir = dir > 0 ? 1 : -1; // Just in case...
        if(currentlyEditing.word != null) {
            alert("A word is currently being edited!")
            return
        }

        const nextChunkId = currentlyEditing.chunk + dir;

        if(nextChunkId in texts[currentlyEditing.textId][1]) {
            currentlyEditing.chunk = nextChunkId;
            texts[currentlyEditing.textId][2] = nextChunkId;
            persistTexts(texts);
        }
    }

    function deleteText(i) {
        if(!confirm("Delete text ", texts[i][0]))
            return;

        localStorage.removeItem("chunks-" + md5(texts[i][0]));
        texts.splice(i, 1);
        persistTexts(texts);

        currentlyEditing = {
            textId: null,
            chunk: null,
            word: null
        }
    }

    function deleteSavedWord({ detail }) {
        if(!confirm("Wanna delete this word?"))
            return;

        savedChunks[currentlyEditing.chunk].splice(detail, 1);
        savedChunks[currentlyEditing.chunk] = savedChunks[currentlyEditing.chunk]
        persistSavedWords(texts[currentlyEditing.textId][0], savedChunks);
    }
</script>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css">

<style>
    .grid { border: 1px solid black; }
    a { display: block; }

    .text-delete-list .text-delete-item a { margin-right: 1em; /* space for the 'x' button */ }

    .text-delete-list .text-delete-item > i {
        display: none;
        position: absolute;
        right: 0;
        top: 0;
    }

    .text-delete-list .text-delete-item:hover > i { display: block; }

    a.active-text-title {
        color: #003;
        text-decoration: underline;
    }
</style>

<div class="ui stackable grid container">
    <div class="three wide column">
        <a href='#' on:click|preventDefault={download}>Export to CSV</a>
        {#if !showTextAdder}
            <a href='#' on:click|preventDefault={() => showTextAdder = true}>
                Add a new text source
            </a>
        {/if}

        {#if texts.length}
            Choose a text source:
            <div class="ui bulleted list text-delete-list">
                {#each texts as text, i (text[0])}
                    <div class="item text-delete-item">
                        <a href="#" on:click|preventDefault={() => selectText(i)}
                           class="{i == currentlyEditing.textId ? "active-text-title" : ""}">
                           {text[0]}
                        </a>
                        <i class="close link red icon" on:click={() => deleteText(i)} />
                    </div>
                {/each}
            </div>
        {/if}

        <div class="centered column row">
            <SavedWordsContainer chunks={savedChunks} active={currentlyEditing}
                                 on:selectSavedWord={selectSavedWord}
                                 on:deleteSavedWord={deleteSavedWord}/>
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
                             initialInput={initialInput}
                             initialTranslation={initialTranslation}

                             on:requestCancelEdit={onCancelEdit}
                             on:saveChunk={onSaveChunk}
                             on:changeChunk={({ detail }) => switchChunk(detail)}/>
            {:else}
                No text.
                <div class="ui divider" />
            {/if}
        </div>

    </div>
</div>
