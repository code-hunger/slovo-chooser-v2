<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let currentId, texts;
</script>

<style>
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

{#if texts.length}
    Choose a text source:
    <div class="ui bulleted list text-delete-list">
        {#each texts as text, i (text[0])}
            <div class="item text-delete-item">
                <a href="#" on:click|preventDefault={() => dispatch("selectText", i)}
                   class="{i == currentId ? "active-text-title" : ""}">
                   {text[0]}
                </a>
                <i class="close link red icon" on:click={() => dispatch("deleteText", i)} />
            </div>
        {/each}
    </div>
{:else}
    Your texts will appear here.
{/if}

