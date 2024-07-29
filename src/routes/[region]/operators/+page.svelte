<script lang="ts">
	import { ASSETS_BASE, IMAGE_CDN } from "$lib/constants"
	import { base } from "$app/paths"

	const { data } = $props()

	const rarityToNumberMap: { [key: string]: number } = {
		TIER_6: 6,
		TIER_5: 5,
		TIER_4: 4,
		TIER_3: 3,
		TIER_2: 2,
		TIER_1: 1
	}

	const rarityToColorMap: { [key: string]: string } = {
		TIER_6: "bg-orange-400",
		TIER_5: "bg-yellow-200",
		TIER_4: "bg-violet-200",
		TIER_3: "bg-blue-500",
		TIER_2: "bg-lime-300",
		TIER_1: "bg-neutral-100"
	}

	// sort by name alphabetically, as well as higher rarity first
	const charTable = Object.values(data.charTable).sort((a, b) => {
		// prioritize comparing appellation (they are in English (mostly (Pozemka is weird)))
		const toCompareA = a.appellation.trim() !== "" ? a.appellation : a.name
		const toCompareB = b.appellation.trim() !== "" ? b.appellation : b.name

		return (
			rarityToNumberMap[b.rarity] - rarityToNumberMap[a.rarity] ||
			toCompareA.localeCompare(toCompareB)
		)
	})
</script>

<svelte:head>
	<title>{data.strings.operators}</title>
</svelte:head>

<main class="m-auto grid max-w-3xl grid-cols-3 gap-2 p-2 md:grid-cols-4 lg:grid-cols-6">
	{#each charTable as charData}
		<a
			class="{rarityToColorMap[
				charData.rarity
			]} relative aspect-[9/16] overflow-hidden hover:scale-105"
			href="{base}/{data.region}/operators/{charData.charId}"
		>
			<div class="absolute h-full w-full bg-gradient-to-b from-black/20 to-black/90"></div>

			<div class="absolute bottom-0 w-full p-2">
				{#if charData.appellation !== ""}
					<p>{charData.appellation}</p>
				{/if}

				<p class="font-bold">{charData.name}</p>
			</div>

			<div class="center-children absolute right-0 h-10 w-10 bg-black p-1.5">
				<img
					src="{IMAGE_CDN}{ASSETS_BASE}/arts/ui/subprofessionicon/sub_{charData.subProfession}_icon.png"
					alt="Icon of sub profession"
					class="h-auto w-full"
					loading="lazy"
				/>
			</div>

			<img
				src="{IMAGE_CDN}{ASSETS_BASE}/arts/charportraits/{charData.charId}_1.png"
				alt="Portrait of {charData.name}"
				class="h-auto w-full"
				loading="lazy"
			/>
		</a>
	{/each}
</main>
