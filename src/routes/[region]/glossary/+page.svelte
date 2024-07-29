<script>
    import Richtext from "$src/components/Richtext.svelte"

    const { data } = $props()
</script>

<svelte:head>
    <title>{data.strings.glossary}</title>
</svelte:head>

<main class="max-w-3xl m-auto p-2">
    {#each Object.values(data.richtextTable.termDescriptionDict) as term}
        <div id={term.termId} class="bg-black/40 p-2 mb-2">
            <p class="font-bold text-lg">{term.termName}</p>
            <Richtext text={term.description} />
        </div>
    {/each}
</main>
