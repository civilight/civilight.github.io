<script lang="ts">
	import type { PageProps } from "./$types"

	const { data }: PageProps = $props()
</script>

<main class="m-auto max-w-xl p-2">
	<h1 class="text-2xl font-bold">{data.name}</h1>
	<h3 class="mb-5 text-xl">{data.intro}</h3>

	{#each data.songs as song}
		<div class="mb-3 border border-slate-300 bg-slate-100 p-1">
			<p>{song.name}</p>
			<p class="mb-3 text-neutral-600">{song.artists.join(", ")}</p>

			<div class="flex flex-col gap-1">
				<audio class="h-full w-full" src={song.sourceUrl} controls preload="metadata"></audio>

				{#if song.lyricUrl}
					<a
						href={song.lyricUrl}
						class="rounded-sm border border-neutral-400 bg-neutral-300 p-1 text-center"
						referrerpolicy="no-referrer"
					>
						Download lyrics
					</a>
				{/if}
			</div>
		</div>
	{/each}
</main>
