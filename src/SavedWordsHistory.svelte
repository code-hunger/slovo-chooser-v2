<script>
    import _ from "lodash"
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let chunks, active;

    $: numberOfWords = _.reduce(chunks, (acc, val) => acc + val.length, 0)

    console.log(chunks)
</script>

<style>
    .saved-words {
        outline: 1px dotted black;
    }

    .saved-word {
        cursor: pointer;
    }

    .saved-words .saved-word > i.delete-saved-word {
        display: none;
        float: right;
        margin-left: 1ex;
    }

    .saved-words .saved-word:hover > i.delete-saved-word {
        display: inline-block;
    }

    .currently-editing {
        font-style: italic;
        opacity: 0.5;
        cursor: disabled;
        pointer-events: none;
    }
</style>

{#if numberOfWords}
    Saved ({numberOfWords}):
    <!-- <div class="ui items ">
    <div class="item"> -->
            <div class="ui bulleted list saved-words">
                {#each Object.keys(chunks) as chunkId}
                    {#each chunks[chunkId] as savedWord, i}
                        <div class="item saved-word {active.chunk == chunkId && active.word == i ? "currently-editing" : ""}"
                             on:click={() => dispatch("selectSavedWord", {chunk: chunkId, word: i})}>
                             <b>{savedWord.input}</b>:
                             {savedWord.translation}

                             <i class="close link red icon delete-saved-word"
                                on:click|stopPropagation={() => dispatch("deleteSavedWord", i)} />
                        </div>
                    {/each}
                {/each}
            </div>
        <!--</div>
    </div>-->
{:else}
    The words you save will appear here.
{/if}

