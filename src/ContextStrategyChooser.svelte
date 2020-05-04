<script>
    export let chosenStrategy = 2, words, initialContext = '';

    const strategies = [
        {
            desc: "Keep same (no changes)",
            call: function() {  },
            viable: initialContext.length > 0
        },
        {
            desc: 'Use the whole chunk as a context',
            call: function () {},
            viable: true
        },
        {
            desc:'Choose only part of the chunk to use as a context.',
            call: function () {},
            viable: true
        }
    ];
</script>

<style type="text/css" media="screen">
    .form label { cursor: default; }
</style>

{#if words}
    <div class="ui form">
        <div class="inline fields">
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
{:else}
    No words :( So no context could be selected.
{/if}
