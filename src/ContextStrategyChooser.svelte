<script>
    import PartialContextSelector from "./ContextSelectors/PartialContextSelector.svelte";
    import KeepContextSelector from "./ContextSelectors/KeepContextSelector.svelte";
    import ManualContextSelector from "./ContextSelectors/ManualContextSelector.svelte"

    export let chosenStrategy, words, initialContext = '', selectedContext;

    $: chosenStrategy = (!initialContext && 3 || 0);

    const strategies = [
        {
            desc: "Keep same (no changes)",
            component: KeepContextSelector,
            properties: { initialContext },
            activate() {}
        },
        {
            desc: 'Empty context',
            activate() { selectedContext = ''; }
        },
        {
            desc: 'Use the whole chunk as a context',
            activate() { selectedContext = words.map(w => w.word).join(' ') }
        },
        {
            desc:'Choose only part of the chunk to use as a context.',
            component: PartialContextSelector,
            properties: { words, selectedContext },
            activate() {}
        },
        {
            desc: "Manually select context",
            component: ManualContextSelector,
            properties: {},
            activate() {}
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
                {#if initialContext && initialContext.length > 0}
                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio"
                                   name="context-strategy"
                                   value={0}
                                   bind:group={chosenStrategy}
                                   id={"context-strategy-option-0"} />
                            <label for={"context-strategy-option-0"}>{strategies[0].desc}</label>
                        </div>
                    </div>
                {/if}
                {#each (strategies) as strategy, i}
                    {#if i > 0}
                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio"
                                   name="context-strategy"
                                   value={i}
                                   bind:group={chosenStrategy}
                                   on:change={strategy.activate}
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
                bind:selectedContext
                {...strategies[chosenStrategy].properties} />
        </div>
    {/if}
{:else}
    No words :( So no context could be selected.
{/if}
