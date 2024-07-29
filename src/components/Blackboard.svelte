<script lang="ts">
	import type { BlackboardEntry } from "$lib/types"

	type Props = {
		data: BlackboardEntry[]
	}

	const { data }: Props = $props()
</script>

<table>
	<tbody>
		{#each data as entry}
			<tr>
				<td>{entry.key}</td>
				<td>{entry.valueStr || entry.value}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style lang="postcss">
	table {
		@apply w-full;
	}

	td {
		@apply border border-neutral-200/50;
		@apply p-1;
	}

	td {
		@apply text-center;
	}
</style>
