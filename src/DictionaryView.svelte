<script>
    import update from "immutability-helper"
    import { arrayToggle, wordToggleMark, wordUnmark, containsWord, smartToggleSubstring, smartRemoveFromString } from "./utils.js"
    import _ from "lodash"

    export let searchTerm;

    let url = JSON.parse(localStorage.getItem('dictionary') || '""');
    let open = true;

    function configureDict() {
        let newUrl = prompt('Enter a dict url!', 'https://')
        if(!/\{\}/.test(newUrl))
            alert("Can't accept this url because it doesn't contain a '{}' to replace the word with.");
        else {
            url = newUrl;
            localStorage.setItem('dictionary', JSON.stringify(url));
        }
    }

    function closeDict() {
        open = false;
    }

    $: searchURL = url.replace('{}', searchTerm)
</script>

<style>
    .dictionary {
        position: relative;
        display: block;
        width: 100%;
        padding: 1em;
    }

    iframe {
        height: 500px;
    }

    .setup-button {
        display: block;
        float: right;
    }

    .close {
        float: right;
    }
</style>

<div class="dictionary">
    {#if !open}
        <a href="#" on:click|preventDefault={configureDict} class="setup-button">
            Set up a dictionary URL.
        </a>
    {/if}
    {#if url}
        {#if open}
            <button on:click={closeDict} class="ui icon button close">
                Close
                <i class="close link icon"></i>
            </button>
        {/if}
        {#if searchTerm}
            {#if open}
                <iframe src={searchURL} width="100%" />
            {:else}
                <a href="#" on:click|preventDefault={() => open = true}>Open the dictionary</a>
            {/if}
        {/if}
    {:else}
        {#if !searchTerm}
            No search term entered.
        {:else}
            No url set up, can't look up "{searchTerm}"!
        {/if}
    {/if}

</div>


