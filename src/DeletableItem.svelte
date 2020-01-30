<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let classes = [], disabled = false;
</script>

<style>
    .item-holder { margin-right: 1.5em; /* space for the 'x' button */ }

    .deletable-item > i.close.icon {
        display: none ;
        position: absolute;
        right: 0;
        top: 3px;
    }

    .deletable-item:hover > i.close.icon { display: block ; }
</style>

<div class="item deletable-item {classes.join(' ')}" on:click={() => !disabled && dispatch("click")}>
    <div class="item-holder">
        <slot />
    </div>

    {#if !disabled}
        <i class="close link red icon delete-saved-word"
           on:click|stopPropagation={() => dispatch("delete")} />
    {/if}
</div>
