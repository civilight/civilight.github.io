<script>
	import Richtext from "$src/components/Richtext.svelte"

	const { data } = $props()
</script>

<svelte:head>
	<title>{data.strings.glossary}</title>
</svelte:head>

<main class="m-auto max-w-3xl p-2">
	{#each Object.values(data.richtextTable.termDescriptionDict) as term}
		<div id={term.termId} class="mb-2 bg-black/40 p-2">
			<p class="text-lg font-bold">{term.termName}</p>
			<p class="mb-3 text-neutral-400">{term.termId}</p>

			<Richtext text={term.description} />
		</div>
	{/each}
</main>
