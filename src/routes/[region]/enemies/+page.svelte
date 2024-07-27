<script>
    import { base } from "$app/paths"

    import { IMAGE_CDN, ASSETS_BASE } from "$lib/constants"

    import ItemIcon from "$src/components/ItemIcon.svelte"

    const { data } = $props()

    const displayedEnemies = Object.values(data.enemiesTable).toSorted(
        (a, b) => a.sortId - b.sortId,
    )
</script>

<svelte:head>
    <title>{data.strings.enemies}</title>
</svelte:head>

<main
    class="max-w-3xl m-auto p-3 grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7"
>
    {#each displayedEnemies as enemy (enemy.enemyId)}
        {@const url = data.availableIcons.includes(enemy.enemyId)
            ? `${IMAGE_CDN}${ASSETS_BASE}/enemy/${enemy.enemyId}.png`
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
                <ItemIcon {url} name={enemy.name} />
            </div>
        </a>
    {/each}
</main>
