<script>
    import { base } from "$app/paths"

    import { IMAGE_CDN, ASSETS_BASE } from "$lib/constants"
    import { GetRegionalString } from "$lib/utils"

    import ItemIcon from "$src/components/ItemIcon.svelte"

    const { data } = $props()

    const displayedEnemies = Object.values(data.enemies)
        //.filter((v) => v.appearsInHandbook)
        .toSorted(
            (a, b) =>
                a.sortId - b.sortId,
        )
</script>

<svelte:head>
    <title>Enemies</title>
</svelte:head>

<main
    class="max-w-3xl m-auto pt-6 pb-6 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7"
>
    {#each displayedEnemies as enemy (enemy.enemyId)}
        {@const url = data.availableIcons.includes(enemy.enemyId)
            ? `${IMAGE_CDN}${ASSETS_BASE}/enemy/${enemy.enemyId}.png`
            : "/missing.png"}

        <a
            href="{base}/{data.lang}/enemies/{enemy.enemyId}"
            class="relative hover:scale-110"
            title={GetRegionalString(enemy.name, data.lang)}
        >
            <div
                class="min-w-[30%] text-center absolute right-0 bg-black p-1"
            >
                <p>{enemy.code}</p>
            </div>

            <div class="aspect-square">
                <ItemIcon
                    {url}
                    name={GetRegionalString(enemy.name, data.lang)}
                />
            </div>
        </a>
    {/each}
</main>
