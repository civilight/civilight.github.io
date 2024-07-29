<script>
	import { base } from "$app/paths"

	const { children, data } = $props()
</script>

{#snippet link(text, destination)}
	<a
		href="{base}/{data.region}/{destination}"
		class="center-children h-full grow odd:bg-slate-600 hover:bg-slate-800"
	>
		<p>{text}</p>
	</a>
{/snippet}

<div class="fixed z-10 h-10 w-full bg-slate-700 text-gray-200">
	<div class="center-children m-auto h-full w-full md:w-[50%] xl:w-[30%]">
		{@render link(data.strings.depot, "depot")}
		{@render link(data.strings.enemies, "enemies")}
		{@render link(data.strings.operators, "operators")}
		{@render link(data.strings.glossary, "glossary")}
	</div>
</div>

<div class="min-w-dvw min-h-dvh bg-gray-800 pt-10 text-gray-200">
	{@render children()}
</div>
