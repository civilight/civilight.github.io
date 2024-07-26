<script>
    import { base } from "$app/paths"

    import { IMAGE_CDN, ASSETS_BASE } from "$lib/constants"

    import ItemIcon from "$src/components/ItemIcon.svelte"

    const { data } = $props()

    const itemTable = Object.entries(data.itemTable).toSorted((a, b) => {
        return a[1].sortId - b[1].sortId
    })
</script>

<svelte:head>
    <title>{data.strings.depot}</title>
</svelte:head>

<main
    class="max-w-2xl m-auto pt-6 pb-6 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7"
>
    {#each itemTable as [itemId, item] (itemId)}
        {@const url = data.availableIcons.includes(item.iconId)
            ? `${IMAGE_CDN}${ASSETS_BASE}/items/${item.iconId}.png`
            : "/missing.png"}

        <a
            href="{base}/{data.region}/depot/{itemId}"
            class="hover:scale-110"
            title={item.name}
        >
            <div class="aspect-square">
                <ItemIcon {url} name={item.name} />
            </div>
        </a>
    {/each}
</main>
