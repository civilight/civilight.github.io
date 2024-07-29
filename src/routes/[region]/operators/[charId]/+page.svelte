<script>
	import { ASSETS_BASE, IMAGE_CDN } from "$lib/constants"

	import Skill from "$src/components/operators/Skill.svelte"

	const { data } = $props()
	const charData = data.charData
</script>

<svelte:head>
	<title>{charData.name}</title>
</svelte:head>

<main class="max-w-3xl m-auto p-2 center-children flex-col">
	<h1 class="font-bold text-2xl">{charData.name}</h1>

	{#if charData.appellation.trim() !== ""}
		<p>{charData.appellation}</p>
	{/if}

	{#if charData.description !== ""}
		<div class="center-children mt-5 flex-col text-center">
			<p>{charData.description}</p>
			<p class="italic">{charData.flavorText}</p>
		</div>
	{/if}

	<div class="center-children gap-3 mt-5 mb-5">
		<p>{charData.code}</p>

		<div class="w-8 h-8 center-children">
			<img
				src="{IMAGE_CDN}{ASSETS_BASE}/arts/ui/[uc]charcommon/profession/icon_profession_{charData.profession.toLowerCase()}.png"
				alt="Icon of profession"
			/>
		</div>

		<div class="w-8 h-8 center-children">
			<img
				src="{IMAGE_CDN}{ASSETS_BASE}/arts/ui/subprofessionicon/sub_{charData.subProfession}_icon.png"
				alt="Icon of sub profession"
			/>
		</div>
	</div>

	{#each charData.skills as skillData}
		<Skill {skillData} strings={data.strings} />
	{/each}
</main>
