<script charset="utf-8">
    let open = true;
</script>

<style type="text/css" media="screen">
    .header { position: relative; }
    .title { float: left; }
    .button { float: right; }
    .header:after { content: ''; clear: both; display: block; }
</style>

<div class="header">
    <div class="title"><slot name="title" /></div>

    <div class="button">(<a href="#" on:click|preventDefault={() => open = !open}>{open ? "hide" : "show"}</a>)</div>
</div>

{#if open}
    <slot name="content" />
{/if}
