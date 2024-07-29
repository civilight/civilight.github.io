<script>
    import { base } from "$app/paths"
    import { IMAGE_CDN, ASSETS_BASE } from "$lib/constants"

    const { data } = $props()

    const displayedEnemies = Object.values(data.enemiesTable).toSorted(
        (a, b) => a.sortId - b.sortId,
    )
</script>

<svelte:head>
    <title>{data.strings.enemies}</title>
</svelte:head>

<main
    class="max-w-3xl m-auto p-2 grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7"
>
    {#each displayedEnemies as enemy (enemy.enemyId)}
        {@const iconPath = data.iconPaths[enemy.enemyId]}
        {@const url = iconPath
            ? `${IMAGE_CDN}${ASSETS_BASE}/${iconPath}`
            : "/missing.png"}

        <a
            href="{base}/{data.region}/enemies/{enemy.enemyId}"
            class="relative hover:scale-110"
            title={enemy.name}
        >
            <div class="min-w-[30%] text-center absolute right-0 bg-black p-1">
                <p>{enemy.code}</p>
            </div>

            <div class="aspect-square">
                <img src={url} alt="Icon of {enemy.name}" />
            </div>
        </a>
    {/each}
</main>
