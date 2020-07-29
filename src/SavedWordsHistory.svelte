<script>
    import _ from "lodash"
    import { createEventDispatcher } from 'svelte';
    import DeletableItem from "./DeletableItem.svelte"

    const dispatch = createEventDispatcher();

    export let chunks, activeChunk, activeWord;

    $: numberOfWords = _.reduce(chunks, (acc, val) => acc + val.length, 0)

    function makeDispatcher (name, chunk, word) {
        return () => dispatch(name, {chunk, word});
    }
</script>

<style>
    .saved-word {
        cursor: pointer;
    }

    .currently-editing {
        text-decoration: underline;
        color: #001f3f;
        cursor: disabled;
        pointer-events: none;
    }
</style>

{#if numberOfWords}
    Saved ({numberOfWords}):
    <div class="ui bulleted list saved-words">
        {#each Object.keys(chunks) as chunkId}
            {#each chunks[chunkId] as savedWord, i}
                <DeletableItem on:click={makeDispatcher('select', chunkId, i)}
                               on:delete={makeDispatcher('delete', chunkId, i)}>
                    <div class="saved-word"
                         class:currently-editing={activeChunk == chunkId && activeWord == i}
                         tabindex=0>
                        <b>{savedWord.input}</b>:
                        {savedWord.translation}
                    </div>
                </DeletableItem>
            {/each}
        {/each}
    </div>
{:else}
    The words you save will appear here.
{/if}

