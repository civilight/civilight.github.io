<script lang="ts">
	import { ASSETS_BASE, IMAGE_CDN } from "$lib/constants"

	import Skill from "$src/components/operators/Skill.svelte"
	import Richtext from "$src/components/Richtext.svelte"
	import Blackboard from "$src/components/Blackboard.svelte"

	const { data } = $props()
	const charData = data.charData

	const PhaseToEliteIcon: { [k: string]: String } = {
		PHASE_0: "elite_0",
		PHASE_1: "elite_1",
		PHASE_2: "elite_2"
	}
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

	<div class="mb-5 flex w-full flex-col gap-1 bg-black/40 p-1">
		{#each charData.traits as traitData}
			<div class="bg-black/30 p-2">
				<div class="mb-2 flex h-8 place-items-center gap-2">
					<img
						src="{IMAGE_CDN}{ASSETS_BASE}/arts/elite_hub/{PhaseToEliteIcon[
							traitData.unlockCondition.phase
						]}.png"
						alt="Icon of elite phase"
					/>

					<p>Lv. {traitData.unlockCondition.level}</p>
				</div>

				<Richtext text={traitData.description} blackboard={traitData.blackboard} />

				{#if traitData.blackboard}
					<details class="mt-2 bg-gray-300/10 p-1">
						<summary class="desc">{data.strings.blackboard}</summary>
						<Blackboard data={traitData.blackboard} />
					</details>
				{/if}
			</div>
		{/each}
	</div>

	<div class="mb-5 flex w-full flex-col gap-1 bg-black/40 p-1">
		{#each charData.talents as talentData}
			<table class="bg-black/30">
				<tbody>
					<tr class="bg-gray-600/30">
						<th colspan="2">{talentData.name}</th>
					</tr>

					{#each talentData.candidates as candidate}
						<tr>
							<td class="desc">
								<div class="center-children flex-col md:flex-row">
									<img
										src="{IMAGE_CDN}{ASSETS_BASE}/arts/elite_hub/{PhaseToEliteIcon[
											candidate.unlockCondition.phase
										]}.png"
										alt="Icon of elite phase"
									/>

									{#if candidate.requiredPotentialRank > 0}
										<img
											src="{IMAGE_CDN}{ASSETS_BASE}/arts/potential_hub/potential_{candidate.requiredPotentialRank}_small.png"
											alt="Icon of potential"
										/>
									{/if}

									{#if candidate.unlockCondition.level > 1}
										<p>Lv. {candidate.unlockCondition.level}</p>
									{/if}
								</div>
							</td>
							<td>
								<Richtext
									text={candidate.description}
									blackboard={candidate.blackboard}
								/>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/each}
	</div>

	{#each charData.skills as skillData}
		<Skill {skillData} strings={data.strings} />
	{/each}
</main>

<style lang="postcss">
	td,
	th {
		@apply border border-neutral-200/50;
		@apply p-1;
		@apply text-left;
	}

	img {
		@apply max-h-full max-w-full;
	}

	.desc {
		@apply p-0 pl-4 pr-4;
	}
</style>
