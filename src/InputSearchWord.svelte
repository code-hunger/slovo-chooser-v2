<script>
    import { trimPunctuation } from "./utils.js"
    import { tick, createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let inputValue, initialInput, wasSearched;

    function clearInput() {
        inputValue = '';
    }

    $: console.log(wasSearched);

    function searchLowercase() { inputValue = inputValue.toLowerCase(); dispatch('inputKeyup') }
    function searchBackspace() { inputValue = inputValue.slice(0, -1); dispatch('inputKeyup') }
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
</style>

{#if initialInput}
    <label>Currently editing: <i>{initialInput}</i></label>
{/if}

{#if inputValue}
    <div>
        <a href="#" on:click={searchLowercase}><i class="arrow alternate circle down outline icon" /></a>
        <a href="#" on:click={searchBackspace}><i class="arrow alternate circle left outline icon" /></a>
        <a href="#" on:click={searchTrim}><i class="cut icon" /></a>
    </div>
{/if}

<div class="ui action icon input">
    <input type="text"
           placeholder="Search words"
           class="myinput"
           class:was-searched={wasSearched}
           bind:value={inputValue}
           on:keyup={e => dispatch('inputKeyup', e)}
           on:keydown={e => {if(e.keyCode == 13) applySearch()}} />
   <i class="close link icon" on:click={clearInput}></i>
   <button class="ui icon button" on:click={applySearch}>
       <i class="search icon" />
   </button>
</div>
