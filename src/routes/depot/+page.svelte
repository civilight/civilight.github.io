<script>
    import { base } from "$app/paths"
    import { IMAGE_CDN, ASSETS_BASE } from "$lib/constants"
    import { GetRegionalString } from "$lib/utils"

    import ItemIcon from "$src/components/ItemIcon.svelte"

    const { data } = $props()
</script>

<svelte:head>
    <title>Depot</title>
</svelte:head>

<main
    class="max-w-2xl m-auto pt-6 pb-6 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
>
    {#each Object.entries(data.itemTable) as [itemId, item] (itemId)}
        {@const url = data.availableIcons.includes(item.iconId)
            ? `${IMAGE_CDN}${ASSETS_BASE}/items/${item.iconId}.png`
            : "/missing.png"}

        <a
            href="{base}/depot/{itemId}"
            class="hover:scale-110"
            title={GetRegionalString(item.name)}
        >
            <div class="aspect-square">
                <ItemIcon {url} name={GetRegionalString(item.name)} />
            </div>
        </a>
    {/each}
</main>
