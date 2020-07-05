<script>
    import _ from "lodash"
    import { createEventDispatcher } from 'svelte';
    import DeletableItem from "./DeletableItem.svelte"
    import chunkStore from "./chunksStore.js"

    const dispatch = createEventDispatcher();

    export let active;

    $: numberOfWords = _.reduce($chunkStore, (acc, val) => acc + val.length, 0)

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
        {#each Object.keys($chunkStore) as chunkId}
            {#each $chunkStore[chunkId] as savedWord, i}
                <DeletableItem on:click={makeDispatcher('select', chunkId, i)}
                               on:delete={makeDispatcher('delete', chunkId, i)}>
                    <div class="saved-word"
                         class:currently-editing={active.chunk == chunkId && active.word == i}
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

