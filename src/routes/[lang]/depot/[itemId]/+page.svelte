<script>
    import { ASSETS_BASE, IMAGE_CDN } from "$lib/constants"
    import { GetRegionalString } from "$lib/utils"

    import ItemIcon from "$src/components/ItemIcon.svelte"

    const { data } = $props()

    const iconUrl = data.hasIcon
        ? `${IMAGE_CDN}${ASSETS_BASE}/items/${data.itemData.iconId}.png`
        : "/missing.png"
</script>

<svelte:head>
    <title>{GetRegionalString(data.itemData.name)}</title>
</svelte:head>

<div class="max-w-xl min-h-dvh m-auto pt-6 pb-6 flex place-items-center">
    <main class="w-full h-fit flex flex-row place-items-center">
        <div class="w-[30%] h-fit pr-4">
            <ItemIcon
                url={iconUrl}
                name={GetRegionalString(data.itemData.name)}
            />
        </div>

        <div class="w-[70%] h-fit">
            <p class="text-2xl font-bold">
                {GetRegionalString(data.itemData.name)}
            </p>
            <p class="pb-4 text-gray-400">{data.itemData.itemId}</p>

            <p class="pb-2">{GetRegionalString(data.itemData.description)}</p>
            <p class="italic">{GetRegionalString(data.itemData.usage)}</p>
        </div>
    </main>
</div>
