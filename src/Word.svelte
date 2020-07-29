<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let word, index, markedClass;
</script>

<style>
    .word-wrapper {
        display: inline-block;
        position: relative;
    }

    .word {
        padding: 0.5ex;
        cursor: pointer;
        color: #0c0;
        transition: background-color 0.5s;
        text-align: center;
    }

    .word:hover {
        background-color: #dfd;
    }

    .word.marked {
        font-weight: bold;
        text-decoration: underline;
    }

    .word::after {
        /* Required to make the word occupy as much space as it would if it were *bold*.
           Otherwise, adding the "unknown" class on a word makes it wider and
           shifts the words right to it on the same line, which is not intended. */
        display: block;
        padding: 0 0.4ex;

        content: attr(title);
        font-weight: bold;
        height: 0;
        overflow: hidden;
        visibility: hidden;
    }

    .tooltip {
        position: absolute;
        top: -1.5ex;
        left: 0;
        padding-left: 1ex;
        font-size: 1.5ex;
        color: #444;
        opacity: 0.8;
    }

    .word.unknown {
        background-color: #FF8;
    }

    .word.unknown + .tooltip {
        color: blue;
        padding: 0 1ex;
        opacity: 1;
    }

    .word.entered + .tooltip {
        opacity: 1;
    }
</style>

<div class="word-wrapper">
    <div class="word {word.marked ? "marked " + markedClass : ""}"
         title={word.word}
         on:click>
        {word.word}
    </div>
    <div class="tooltip">
        {index + 1}
    </div>
</div>
