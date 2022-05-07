<script charset="utf-8">
    export let initialContext, selectedContext;

    $: selectedContext = initialContext;
</script>

<b style="color: darkblue">Saved context:</b>
<em>{@html initialContext}</em>
