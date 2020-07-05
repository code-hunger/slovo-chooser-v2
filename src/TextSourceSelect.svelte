<script>
    import { createEventDispatcher } from "svelte";
    import DeletableItem from "./DeletableItem.svelte"

    const dispatch = createEventDispatcher();

    export let currentId, texts;

    function makeDispatcher(name, word) {
        return () => dispatch(name, word);
    }
</script>

<style>
    .item { cursor: pointer; }

    /* colors from https://clrs.cc/ */
    .item-link { color: #0074D9; }

    .item-link.active-text-title {
        color: #001f3f;
        text-decoration: underline;
    }
</style>

{#if texts.length}
    Choose a text source:
    <div class="ui bulleted list">
        {#each texts as text, i (text[0])}
            <DeletableItem on:click={makeDispatcher("select", i)} on:delete={makeDispatcher("delete", i)}>
                <div class="item" class:active-text-title={i == currentId} tabindex=0>
                    <span class="item-link">
                        {text[0]}
                    </span>
                    ({text[2] + 1} / {text[1].length})
                </div>
            </DeletableItem>
        {/each}
    </div>
{:else}
    Your texts will appear here.
{/if}

