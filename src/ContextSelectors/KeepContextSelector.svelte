<script charset="utf-8">
    export let initialContext, selectedContext;

    $: selectedContext = initialContext;
</script>

<em>{initialContext}</em>
