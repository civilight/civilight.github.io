<script>
	import { ASSETS_BASE, IMAGE_CDN } from "$lib/constants"

	import Skill from "$src/components/operators/Skill.svelte"

	const { data } = $props()
	const charData = data.charData
</script>

<svelte:head>
	<title>{charData.name}</title>
</svelte:head>

<main class="center-children m-auto max-w-3xl flex-col p-2">
	<h1 class="text-2xl font-bold">{charData.name}</h1>

	{#if charData.appellation.trim() !== ""}
		<p>{charData.appellation}</p>
	{/if}

	{#if charData.description !== ""}
		<div class="center-children mt-5 flex-col text-center">
			<p>{charData.description}</p>
			<p class="italic">{charData.flavorText}</p>
		</div>
	{/if}

	<div class="center-children mb-10 mt-5 gap-3">
		<p>{charData.code}</p>

		<div class="center-children h-8 w-8">
			<img
				src="{IMAGE_CDN}{ASSETS_BASE}/arts/ui/[uc]charcommon/profession/icon_profession_{charData.profession.toLowerCase()}.png"
				alt="Icon of profession"
			/>
		</div>

		<div class="center-children h-8 w-8">
			<img
				src="{IMAGE_CDN}{ASSETS_BASE}/arts/ui/subprofessionicon/sub_{charData.subProfession}_icon.png"
				alt="Icon of sub profession"
			/>
		</div>
	</div>

	<div class="mb-5 w-full bg-black/40"></div>

	{#each charData.skills as skillData}
		<Skill {skillData} strings={data.strings} />
	{/each}
</main>
