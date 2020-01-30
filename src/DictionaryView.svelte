<script>
    import update from "immutability-helper"
    import { arrayToggle, wordToggleMark, wordUnmark, containsWord, smartToggleSubstring, smartRemoveFromString } from "./utils.js"
    import _ from "lodash"

    export let searchTerm;

    let url = localStorage.getItem("dictionary") || '';
    let open = true;

    function configureDict() {
        let newUrl = prompt("Enter a dict url!", "https://")
        if(!/\{\}/.test(newUrl))
            alert("Can't accept this url because it doesn't contain a'{}' to replace the word with.");
        else {
            url = newUrl;
            localStorage.setItem('dictionary', url);
        }
    }

    function closeDict() {
        open = false;
    }
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
</style>

<div class="dictionary">
    <a href="#" on:click|preventDefault={configureDict} class="setup-button">
        Set up a dictionary URL.
    </a>
    {#if url}
        {#if open}
            <button on:click={closeDict} class="ui icon button ">
                <i class="close link icon"></i>
                Close
            </button>
        {/if}
        {#if searchTerm}
            {#if open}
                <iframe src={url.replace("{}", searchTerm)} width="100%" />
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


