<script>
    import ItemIcon from "$src/components/ItemIcon.svelte"

    const { data } = $props()
</script>

<svelte:head>
    <title>{data.name}</title>
</svelte:head>

<div class="max-w-xl min-h-dvh m-auto pt-6 pb-6 flex place-items-center">
    <main class="w-full h-fit flex flex-row place-items-center">
        <div class="w-[30%] h-fit pr-4">
            <ItemIcon url={data.iconUrl} name={data.name} />
        </div>

        <div class="w-[70%] h-fit">
            <p class="text-2xl font-bold">
                {data.name}
            </p>
            <p class="pb-4 text-gray-400">{data.itemId}</p>

            <p class="pb-4">{data.description}</p>
            <p class="italic">{data.usage}</p>
        </div>
    </main>
</div>
