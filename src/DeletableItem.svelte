<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let classes = [], disabled = false;
</script>

<style>
    .item-holder {
        /* space for the 'x' button, because it has absolute position */
        margin-right: 1.5em;
    }

    .deletable-item > .delete-saved-word {
        display: none ;
        position: absolute;
        right: 0;
        top: 10%;
    }

    .non-button {
        background: none;
        border: none;
        padding: 0;
    }

    .deletable-item:hover > .delete-saved-word,
    .deletable-item:focus > .delete-saved-word { display: block ; }
</style>

<div class="item deletable-item {classes.join(' ')}"
     on:click={() => !disabled && dispatch("click")}>
    <div class="item-holder">
        <slot />
    </div>

    {#if !disabled}
        <button class="non-button delete-saved-word">
            <i class="close link red icon" on:click|stopPropagation={() => dispatch("delete")} />
        </button>
    {/if}
</div>
