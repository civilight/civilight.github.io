<script lang="ts">
	import type { ParsedSkill } from "$lib/logic/operators"
	import type { LocalizationTable } from "$lib/types"

	import { ASSETS_BASE, IMAGE_CDN } from "$lib/constants"

	import Richtext from "$src/components/Richtext.svelte"
	import Blackboard from "$src/components/Blackboard.svelte"

	type Props = {
		skillData: ParsedSkill
		strings: LocalizationTable
	}

	const { skillData, strings }: Props = $props()
</script>

<div class="center-children mb-2 w-full flex-col rounded-sm bg-black/40 p-1">
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
	<details class="w-full bg-black/50">
		<summary class="p-1 pl-2 pr-2">{strings.level_plural}</summary>
		<table class="mt-2 w-full">
			<thead>
				<tr>
					<th>{strings.level}</th>
					<th>{strings.description}</th>
					<th>{strings.init_sp}</th>
					<th>{strings.sp_cost}</th>
					<th>{strings.duration}</th>
				</tr>
			</thead>

			<tbody>
				{#each skillData.levels as levelData, idx}
					<tr>
						<td>{idx + 1}</td>
						<td class="desc">
							<Richtext
								text={levelData.description}
								blackboard={levelData.blackboard}
							/>
						</td>
						<td>{levelData.spData.initSp > 0 ? levelData.spData.initSp : "-"}</td>
						<td>{levelData.spData.spCost > 0 ? levelData.spData.spCost : "-"}</td>
						<td>{levelData.duration > 0 ? `${levelData.duration}s` : "-"}</td>
					</tr>

					<!-- blackboard for this skill level -->
					<tr>
						<td colspan="5" class="bg-gray-300/10">
							<details>
								<summary class="desc">{strings.blackboard}</summary>
								<Blackboard data={levelData.blackboard} />
							</details>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</details>
</div>

<style lang="postcss">
	td,
	th {
		@apply border border-neutral-200/50;
		@apply p-1;
	}

	td {
		@apply text-center;
	}

	img {
		@apply max-h-full max-w-full;
	}

	.desc {
		@apply text-left;
	}
</style>
