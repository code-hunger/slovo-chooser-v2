<script>
    import { createEventDispatcher } from 'svelte';
    import Word from "./Word.svelte"
    import _ from "lodash"

    const dispatch = createEventDispatcher();

    export let words, markedClass;
</script>

<style>
    .word-collector {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
</style>

<div class="word-collector">
    {#each words as word, i}
        <Word word={word} index={i} markedClass={markedClass} on:click={event => dispatch("wordClick", { i, word, event })} />
    {/each}
</div>
