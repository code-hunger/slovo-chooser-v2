<script>
    import _ from "lodash"
    import Hideable from "./Hideable.svelte";

    export let marked;

    $: numberOfWords = _.reduce(marked, (acc, val) => acc + val.length, 0)
</script>

{#if numberOfWords}
    <Hideable>
        <div slot="title">
            <h4>Marked ({numberOfWords})</h4>
        </div>
        <div slot="content">
            <div class="ui bulleted list saved-words">
                {#each Object.keys(marked) as chunkId}
                    {#if marked[chunkId].length}
                        <div class="item">
                            {chunkId}: {marked[chunkId].join(', ')}
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    </Hideable>
{:else}
    Your marked words will appear here.
{/if}
