<script>
    import PartialContextSelector from "./PartialContextSelector.svelte";
    import KeepContextSelector from "./KeepContextSelector.svelte";

    export let chosenStrategy = 2, words, initialContext = '';

    $: strategies = [
        {
            desc: "Keep same (no changes)",
            viable: initialContext && initialContext.length > 0,
            component: KeepContextSelector,
            properties: { initialContext }
        },
        {
            desc: 'Use the whole chunk as a context',
            viable: true
        },
        {
            desc:'Choose only part of the chunk to use as a context.',
            viable: true,
            component: PartialContextSelector,
            properties: { words }
        }
    ];
</script>

<style type="text/css" media="screen">
    .form label { cursor: default; }

    .column { background: inherit; }
</style>

{#if words}
    <div class="seven wide column">
        <div class="ui form">
            <div class="grouped fields">
                {#each (strategies) as strategy, i}
                    {#if strategy.viable}
                        <div class="field">
                            <div class="ui radio checkbox">
                                <input type="radio"
                                       name="context-strategy"
                                       value={i}
                                       bind:group={chosenStrategy}
                                       id={"context-strategy-option-" + i} />
                                <label for={"context-strategy-option-" + i}>{strategy.desc}</label>
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    </div>

    {#if strategies[chosenStrategy].component}
        <div class="nine wide column">
            <svelte:component
                this={strategies[chosenStrategy].component}
                {...strategies[chosenStrategy].properties} />
        </div>
    {/if}
{:else}
    No words :( So no context could be selected.
{/if}
