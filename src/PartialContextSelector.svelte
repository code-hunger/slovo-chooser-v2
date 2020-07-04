<script>
    /*import 'nouislider/distribute/nouislider.css';*/
    import noUiSlider from 'nouislider';
	import { onMount } from 'svelte';

    export let words, selectedContext;

    const chosenEnds = { start: 0, end: words.length - 1 };
    const DEFAULT_WORDS = 15;

    $: selectedContext = words.slice(chosenEnds.start, chosenEnds.end + 1).map(w => w.word).join(' ')

    let slider;

    $: range = { min: 0, max: words.length - 1 }

    onMount(() => {
        slider = document.getElementById('context-strategy-slider');

        noUiSlider.create(slider, {
            start: [0, Math.min(DEFAULT_WORDS, words.length) - 1],
            connect: true,
            behaviour: 'drag',
            range,
            step: 1,
            format: { 
                from(value) { return parseInt(value); },
                to(value) { return parseInt(value); }
            }
        })

        slider.noUiSlider.on('update', function (values) {
            chosenEnds.start = values[0];
            chosenEnds.end = values[1];
        });
    });

    $: if(slider) slider.noUiSlider.updateOptions({ range });
</script>

<style type="text/css" media="screen">
    #context-strategy-slider {
        height: 10px;
    }
</style>

<div id="context-strategy-slider"></div>
{words.slice(chosenEnds.start, chosenEnds.end).map(w => w.word).join(' ')}
