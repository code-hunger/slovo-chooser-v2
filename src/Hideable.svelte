<script charset="utf-8">
    let open = true;
</script>

<style type="text/css" media="screen">
    .header { position: relative; }
    .title { float: left; }
    .button-container { float: right; }
    .button-container button::before { content: "("; color: black; }
    .button-container button::after { content: ")"; color: black; }
    .button-container button { background: inherit; color:dodgerblue; margin: 0; border: none; cursor: pointer; }
    .button-container button:hover { text-decoration: underline; }
    .header:after { content: ''; clear: both; display: block; }
</style>

<div class="header">
    <div class="title"><slot name="title" /></div>

    <div class="button-container">
        <button on:click={() => open = !open}>
            {open ? "hide" : "show"}
        </button>
    </div>
</div>

{#if open}
    <slot name="content" />
{/if}
