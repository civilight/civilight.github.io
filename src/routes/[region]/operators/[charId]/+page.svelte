<script lang="ts">
	import { ASSETS_BASE, IMAGE_CDN } from "$lib/constants"

	import Richtext from "$src/components/Richtext.svelte"
	import Blackboard from "$src/components/Blackboard.svelte"

	const { data } = $props()
	const charData = data.charData

	const PhaseToEliteIcon: { [k: string]: String } = {
		PHASE_0: "elite_0",
		PHASE_1: "elite_1",
		PHASE_2: "elite_2"
	}

	function NumberToImagePath(number: number) {
		if (number <= 6) {
			return `${IMAGE_CDN}${ASSETS_BASE}/arts/number_hub/solid_${number + 1}.png`
		} else {
			return `${IMAGE_CDN}${ASSETS_BASE}/arts/specialized_hub/specialized_${number - 6}.png`
		}
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

	<!-- Trait -->
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
			</div>
		{/each}
	</div>

	<!-- Talents -->
	<div class="mb-5 w-full bg-black/40 p-1">
		{#each charData.talents as talentData}
			<div class="flex flex-col gap-1 bg-black/40 p-1">
				{#each talentData.candidates as candidate, idx}
					{#if idx === 0 || (idx > 0 && talentData.candidates[idx - 1].name !== candidate.name)}
						<p class="bg-gray-600/30 p-1 font-bold">{candidate.name}</p>
					{/if}

					<div class="bg-black/30 p-1">
						<div class="mb-2 flex h-8 place-items-center gap-1">
							<img
								src="{IMAGE_CDN}{ASSETS_BASE}/arts/elite_hub/{PhaseToEliteIcon[
									candidate.unlockCondition.phase
								]}.png"
								alt="Icon of elite phase"
							/>

							{#if candidate.requiredPotentialRank > 0}
								<img
									src="{IMAGE_CDN}{ASSETS_BASE}/arts/potential_hub/potential_{candidate.requiredPotentialRank}.png"
									alt="Icon of potential"
								/>
							{/if}

							<p>Lv. {candidate.unlockCondition.level}</p>
						</div>

						<Richtext text={candidate.description} blackboard={candidate.blackboard} />
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<!-- Skills -->
	{#each charData.skills as skillData}
		<div class="center-children mb-2 w-full flex-col bg-black/40 p-1">
			<!-- header, includes skill icon and name -->
			<div class="mb-2 flex h-16 w-full">
				<img
					src="{IMAGE_CDN}{ASSETS_BASE}/arts/skills/{skillData.iconPath}"
					alt="Icon of skill {skillData.name}"
					class="mr-3 aspect-square"
				/>

				<p class="font-bold">{skillData.name}</p>
			</div>

			<!-- body, includes levels -->
			<details class="w-full bg-black/40 p-1">
				{#each skillData.levels as levelData, idx}
					<div class="mt-1 bg-black/40 p-1">
						<!-- SP Cost and stuff -->
						<div class="mb-2 flex gap-1">
							<div class="center-children relative h-8 w-fit p-1">
								<img src={NumberToImagePath(idx)} alt="Skill level {idx}" />
							</div>
							<div class="center-children h-8 w-fit bg-orange-400/40 p-1">
								<p>{levelData.spData.initSp}/{levelData.spData.spCost} SP</p>
							</div>
							<div class="center-children h-8 w-fit bg-green-400/40 p-1">
								<p>{levelData.duration > 0 ? `${levelData.duration}s` : "-"}</p>
							</div>
						</div>

						<Richtext text={levelData.description} blackboard={levelData.blackboard} />
					</div>
				{/each}
			</details>
		</div>
	{/each}
</main>

<style lang="postcss">
	img {
		@apply max-h-full max-w-full;
	}
</style>
