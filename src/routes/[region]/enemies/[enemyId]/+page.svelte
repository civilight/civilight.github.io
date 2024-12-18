<script>
	import Richtext from "$src/components/Richtext.svelte"

	const { data: props } = $props()
</script>

<svelte:head>
	<title>{props.name}</title>
</svelte:head>

<main class="m-auto max-w-3xl p-2">
	<!-- Display only on sm and DOWN -->
	<div class="center-children m-auto mb-4 max-w-sm sm:hidden">
		<img src={props.iconUrl} alt="Icon of {props.name}" />
	</div>

	<div class="mb-4 flex">
		<!-- Display only on sm and UP -->
		<div class="mr-2 hidden max-w-[30%] sm:block">
			<img src={props.iconUrl} alt="Icon of {props.name}" />
		</div>

		<div>
			<p class="text-2xl font-bold">{props.name}</p>
			<p class="text-lg font-bold text-slate-400">
				{props.types.join(" ")}
			</p>
		</div>
	</div>

	{#if props.description !== ""}
		<div class="mb-4 bg-black/40 p-2">
			<Richtext text={props.description} />
		</div>
	{/if}

	{#if props.tooltip !== ""}
		<div class="mb-4 bg-black/40 p-2">
			<Richtext text={props.tooltip} />
		</div>
	{/if}

	{#if props.abilities.length > 0}
		<div class="bg-black/40 p-2">
			{#each props.abilities as ability, idx}
				<!-- have top padding only for the titles -->
				{@const shouldPush = idx !== 0 && ability.textFormat === "TITLE"}

				{#if ability.textFormat === "TITLE"}
					<p class="text-lg font-bold text-red-500 {shouldPush ? 'pt-3' : ''}">
						{ability.text}
					</p>
				{:else if ability.textFormat === "NORMAL"}
					<Richtext text={`- ${ability.text}`} />
				{:else if ability.textFormat === "SILENCE"}
					<Richtext text={`× ${ability.text}`} />
				{/if}
			{/each}
		</div>
	{/if}

	<!-- the entire thing below is horrible -->
	<!-- but it works, so alas... -->
	{#each props.levels as level, idx}
		<details class="group mt-4 border border-gray-200/50 bg-black/40">
			<summary class="border-gray-200/50 p-2 group-open:border-b"
				>{`${props.strings.level} ${idx}`}</summary
			>

			<div class="p-2">
				<!-- attributes -->
				<table class="w-full">
					<tbody>
						{#each Object.entries(level.attributes) as [attrKey, attrVal]}
							<tr>
								<td>{attrKey}</td>
								<td>{attrVal}</td>
							</tr>
						{/each}
					</tbody>
				</table>

				<!-- talents -->
				<table class="mt-2 w-full">
					<tbody>
						{#each Object.values(level.talentBlackboard) as talent}
							<tr class="border">
								<td>{talent.key}</td>
								<td>{talent.valueStr || talent.value}</td>
							</tr>
						{/each}
					</tbody>
				</table>

				<!-- skills -->
				<table class="mt-2 w-full">
					<tbody>
						{#each Object.values(level.skills) as skill}
							<tr>
								<th colspan="2">{skill.prefabKey}</th>
							</tr>

							{#each Object.entries(skill) as [attrKey, attrVal]}
								<tr>
									<td>{attrKey}</td>
									<td>{attrVal}</td>
								</tr>
							{/each}
						{/each}
					</tbody>
				</table>
			</div>
		</details>
	{/each}
</main>

<style lang="postcss">
	th,
	td {
		@apply border border-neutral-200/50;
		@apply p-1;
	}
</style>
