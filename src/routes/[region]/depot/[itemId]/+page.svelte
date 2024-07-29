<script>
	const { data } = $props()
</script>

<svelte:head>
	<title>{data.name}</title>
</svelte:head>

<div class="center-children m-auto min-h-dvh max-w-3xl p-2">
	<main class="center-children sm:flex-row; h-fit w-full flex-col gap-3">
		<div class="center-children relative h-fit pr-4 sm:w-[30%]">
			<img src={data.iconUrl} alt="Icon of {data.name}" loading="lazy" class="absolute" />

			<img
				src="/item_background/{data.rarity}.png"
				alt="Background of item's icon, denoting rarity"
				loading="lazy"
			/>
		</div>

		<div class="h-fit sm:w-[70%]">
			<p class="text-2xl font-bold">
				{data.name}
			</p>
			<p class="pb-4 text-gray-400">{data.itemId}</p>

			<p class="pb-4">{data.description}</p>
			<p class="italic">{data.usage}</p>
		</div>
	</main>
</div>

<style lang="postcss">
	img {
		@apply h-full max-h-full w-auto max-w-full object-contain;
	}
</style>
