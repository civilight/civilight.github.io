<script lang="ts">
	import type { PageProps } from "./$types"

	import { base } from "$app/paths"

	let { data }: PageProps = $props()
</script>

<main class="h-sceen grid w-screen grid-cols-4 gap-2 p-2 md:grid-cols-6">
	{#each data.data as album}
		<a
			href="{base}/msr/{album.cid}"
			class="aspect-square h-auto w-full transition-all hover:scale-105"
		>
			<img
				src="https://wsrv.nl/?url={album.coverUrl}&output=webp&q=40"
				class="h-full w-full"
				alt="Album cover for {album.name}"
				loading="lazy"
				width="500"
				height="500"
			/>

			<p>{album.name}</p>
		</a>
	{/each}
</main>
