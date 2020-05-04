<script>
    /*import 'nouislider/distribute/nouislider.css';*/
    import noUiSlider from 'nouislider';
	import { onMount } from 'svelte';

    export let words;

    const chosenEnds = { start: 0, end: words.length - 1 };

    onMount(() => {
        const slider = document.getElementById('context-strategy-slider');

        noUiSlider.create(slider, {
            start: [0, words.length - 1],
            connect: true,
            range: {
                'min': 0,
                'max': words.length - 1
            },
            step: 1
        })

        slider.noUiSlider.on('update', function (values) {
            chosenEnds.start = values[0];
            chosenEnds.end = values[1];
        });
    });
</script>

<style type="text/css" media="screen">
    #context-strategy-slider {
        height: 10px;
    }
</style>

<div id="context-strategy-slider"></div>
{words.slice(chosenEnds.start, chosenEnds.end).map(w => w.word).join(' ')}
