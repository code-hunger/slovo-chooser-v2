<script>
    import { trimPunctuation } from "./utils.js"
    import { tick, createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let inputValue, initialInput, wasSearched;

    $: inputValue = initialInput || '';

    function clearInput() {
        inputValue = '';
    }

    function searchLowercase() { inputValue = inputValue.toLowerCase(); }
    function searchBackspace() { inputValue = inputValue.slice(0, -1); }
    function searchTrim() { inputValue = trimPunctuation(inputValue).trim(); }

    function applySearch() {
        searchTrim();
        dispatch('applySearch')
    }
</script>

<style>
    .input input.myinput.was-searched {
        color: darkgreen;
    }

    .action-links {
        margin-top: 1ex;
    }

    .action-links > a {
        padding: 1ex 2ex 1ex 2ex;
        margin-top: 1ex;
    }

    .action-links > a:hover {
        background: #e9f1fc;
    }

    .action-links > a:active {
        background: #bcd4f6;
    }

</style>

{#if initialInput}
    <label>Currently editing: <i>{initialInput}</i></label>
{/if}

<div class="ui action icon input">
    <input type="text"
           placeholder="Search words"
           class="myinput"
           class:was-searched={wasSearched}
           bind:value={inputValue}
           on:keydown={e => {if(e.keyCode == 13) applySearch()}} />
   <i class="close link icon" on:click={clearInput} style={{display: inputValue ? 'block' : 'none'}}></i>
   <button class="ui icon button" on:click={applySearch} >
       <i class="search icon" />
   </button>
</div>

{#if inputValue}
    <div class="action-links">
        <a href="#" on:click|preventDefault={searchLowercase}><i class="arrow alternate circle down outline icon" /></a>
        <a href="#" on:click|preventDefault={searchBackspace}><i class="arrow alternate circle left outline icon" /></a>
        <a href="#" on:click|preventDefault={searchTrim}><i class="cut icon" /></a>
    </div>
{/if}

