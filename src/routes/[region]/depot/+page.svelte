<script>
    import { base } from "$app/paths"
    import { IMAGE_CDN, ASSETS_BASE } from "$lib/constants"

    const { data } = $props()

    const itemTable = Object.entries(data.itemTable).toSorted((a, b) => {
        return a[1].sortId - b[1].sortId
    })
</script>

<svelte:head>
    <title>{data.strings.depot}</title>
</svelte:head>

<main
    class="max-w-3xl m-auto p-2 gap-1 grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7"
>
    {#each itemTable as [itemId, item] (itemId)}
        {@const iconPath = data.iconPaths[item.iconId]}
        {@const url = iconPath
            ? `${IMAGE_CDN}${ASSETS_BASE}/${iconPath}`
            : "/missing.png"}

        <a
            href="{base}/{data.region}/depot/{itemId}"
            class="aspect-square relative center-children hover:scale-110"
            title={item.name}
        >
            <img
                src="/item_background/{item.rarity}.png"
                alt="Background of item's icon, denoting rarity"
                loading="lazy"
                class="absolute max-w-full max-h-full"
            />

            <img
                src={url}
                alt="Icon of {item.name}"
                loading="lazy"
                class="absolute max-w-full max-h-full"
            />
        </a>
    {/each}
</main>
