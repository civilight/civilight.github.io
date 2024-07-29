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

<div class="w-full center-children flex-col bg-black/40 mb-2 rounded-sm">
	<!-- header, includes skill icon and name -->
	<div class="w-full h-16 flex p-2 mb-2">
		<img
			src="{IMAGE_CDN}{ASSETS_BASE}/arts/skills/{skillData.iconPath}"
			alt="Icon of skill {skillData.name}"
			class="aspect-square mr-3"
		/>

		<p class="font-bold">{skillData.name}</p>
	</div>

	<!-- body, includes levels -->
	<details class="w-full bg-black/50">
		<summary class="pl-2 pr-2 p-1">{strings.level_plural}</summary>
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
						<td>{idx}</td>
						<td class="desc">
							<Richtext
								text={levelData.description}
								blackboard={levelData.blackboard}
							/>
						</td>
						<td>{levelData.spData.initSp}</td>
						<td>{levelData.spData.spCost}</td>
						<td>{levelData.duration > 0 ? `${levelData.duration}s` : "-"}</td>
					</tr>

					<!-- blackboard for this skill level -->
					<tr>
						<td colspan="5" class="bg-neutral-700">
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
		@apply max-w-full max-h-full;
	}

	.desc {
		@apply text-left;
	}
</style>
