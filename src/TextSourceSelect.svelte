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
    .item-link {
        /* colors from https://clrs.cc/ */
        color: #0074D9;
        cursor: pointer;
    }

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
                <div class="item-link" class:active-text-title={i == currentId}>{text[0]}</div>
            </DeletableItem>
        {/each}
    </div>
{:else}
    Your texts will appear here.
{/if}

