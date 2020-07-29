<script>
    import _ from "lodash"
    import { createEventDispatcher } from 'svelte';
    import DeletableItem from "./DeletableItem.svelte"

    export let marked;
    const dispatch = createEventDispatcher();

    $: numberOfWords = _.reduce(marked, (acc, val) => acc + val.length, 0)

    function makeDispatcher (name, chunk, word) {
        return () => dispatch(name, {chunk, word});
    }
</script>

{#if numberOfWords}
    Marked ({numberOfWords}):
    <div class="ui bulleted list saved-words">
        {#each Object.keys(marked) as chunkId}
            {#if marked[chunkId].length}
                <div class="item">
                    {chunkId}: {marked[chunkId].join(', ')}
                </div>
            {/if}
        {/each}
    </div>
{:else}
    Your marked words will appear here.
{/if}

