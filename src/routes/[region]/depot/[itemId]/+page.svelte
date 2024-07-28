<script>
    const { data } = $props()
</script>

<svelte:head>
    <title>{data.name}</title>
</svelte:head>

<div class="max-w-3xl min-h-dvh m-auto p-3 flex place-items-center">
    <main
        class="w-full h-fit flex flex-col gap-3 sm:flex-row place-items-center"
    >
        <div
            class="relative sm:w-[30%] h-fit pr-4 flex place-items-center place-content-center"
        >
            <img
                src={data.iconUrl}
                alt="Icon of {data.name}"
                loading="lazy"
                class="absolute max-w-full max-h-full"
            />

            <img
                src="/item_background/{data.rarity}.png"
                alt="Background of item's icon, denoting rarity"
                loading="lazy"
                class="max-w-full max-h-full"
            />
        </div>

        <div class="sm:w-[70%] h-fit">
            <p class="text-2xl font-bold">
                {data.name}
            </p>
            <p class="pb-4 text-gray-400">{data.itemId}</p>

            <p class="pb-4">{data.description}</p>
            <p class="italic">{data.usage}</p>
        </div>
    </main>
</div>
