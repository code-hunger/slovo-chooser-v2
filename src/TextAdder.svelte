<script>
    import { normalizeLines } from "./utils.js"
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let title = '', greatText = '',
        splitStrategy = 0, joinIfShorter = true, joinIfShorterThan = 30;

    const splitStrategies = [
        {
            description: 'Each line is a separate chunk.',
            action: function () {
                return greatText.split(/\n+/g);
            }
        },
        {
            description: 'A chunk is a single sentence ending in any of ".", "!" or "?".',
            action: function() {
                return greatText.split(/([.!?]+)/g)
                // The reduce now will bring the ending punctuation back to each sentence.
                    .reduce((arr, next, i) => {
                        if(i % 2 == 0) {
                            arr.push(next); // Oh that hurts
                            return arr;
                        }
                        arr[arr.length-1] += next;
                        return arr;
                    }, []);
            }
        }
    ];

    function submit() {
        let lines = splitStrategies[splitStrategy].action();
        lines = joinIfShorter ? normalizeLines(lines, joinIfShorterThan) : lines;

        if(lines.length == 0) {
            alert("No meaningful text entered. Refusing to add.")
            return;
        }

        dispatch("textAdded", { title, lines });
    }
</script>

<style>
    textarea { width: 100%; height: 20em; }
    input[type="number"] { max-width: 2.5em; }

    .form label { cursor: default; }

    #min-elements-types { width: auto; }

    .form .unpadded { padding: 0; }
    .form .unbordered { border-top: 0; border-left: 0; border-right: 0; outline: 0; }

    #join-if-shorter-number[disabled] { opacity: 0.4; }
</style>

<div class="ui form">
    <div class="field">
        <input bind:value={title} placeholder="Your wonderful text's title" />
    </div>

    <div class="field">
        <textarea placeholder="Enter big text!" bind:value={greatText} />
    </div>

    <div class="grouped fields">
        <label>Split strategy:</label>

        {#each (splitStrategies) as strategy, i}
            <div class="field">
                <div class="ui radio checkbox">
                    <input type="radio"
                           name="split-strategy"
                           value={i}
                           bind:group={splitStrategy}
                           id={"strategy-option-" + i} />
                    <label for={"strategy-option-" + i}>{strategy.description}</label>
                </div>
            </div>
        {/each}

        <div class="inline mini fields">
            <div class="ui checkbox">
                <input type="checkbox"
                       name="set-chunk-min-len"
                       bind:checked={joinIfShorter}
                       id="no-short-lines-radio" />

                <label for="no-short-lines-radio">
                    Join chunks if shorter than
                    <input type="number" name="min-elements" class="unpadded unbordered" disabled={!joinIfShorter} bind:value={joinIfShorterThan} id="join-if-shorter-number" />
                    characters.
                </label>
            </div>
        </div>

        <button class="ui button" on:click={submit}>Add!</button>
        <button class="ui button" on:click={() => dispatch("cancelEdit")}>Abort</button>
    </div>
</div>
