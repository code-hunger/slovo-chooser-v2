<script>
    import _ from "lodash"
    import Hideable from "./Hideable.svelte";

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let marked;

    $: numberOfWords = _.reduce(marked, (acc, val) => acc + val.length, 0)
</script>

<style type="text/css" media="screen">
    .item button { background: inherit; color:dodgerblue; padding-left: 0; padding-right: 0; }
    .item button:hover { background: #DDD; }

    .when-empty {
        border-top: 1px solid black;
        border-bottom: 1px solid black;
    }
</style>

{#if numberOfWords}
    <Hideable>
        <div slot="title">
            <h4>Marked ({numberOfWords})</h4>
        </div>
        <div slot="content">
            <div class="ui relaxed list saved-words">
                {#each Object.keys(marked) as chunkId}
                    {#if marked[chunkId].length}
                        <div class="item" style="padding: 0; margin: 0">
                            <button on:click={() => dispatch('selectChunk', chunkId)} class="ui icon compact tiny button">
                                <i class="share square icon"></i>
                            </button>
                            {marked[chunkId].join(', ')}
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    </Hideable>
{:else}
<div class="when-empty">
    Your marked words will appear here.
</div>
{/if}
