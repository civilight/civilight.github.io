<script>
    import ItemIcon from "$src/components/ItemIcon.svelte"

    const { data: props } = $props()
</script>

<svelte:head>
    <title>{props.name}</title>
</svelte:head>

<main class="max-w-3xl m-auto p-3">
    <!-- Display only on sm and DOWN -->
    <div class="block sm:hidden max-w-sm m-auto mb-4">
        <ItemIcon url={props.iconUrl} name={props.name} />
    </div>

    <div class="flex mb-4">
        <!-- Display only on sm and UP -->
        <div class="mr-2 hidden sm:block max-w-[30%]">
            <ItemIcon url={props.iconUrl} name={props.name} />
        </div>

        <div>
            <p class="font-bold text-2xl">{props.name}</p>
            <p class="font-bold text-lg text-slate-400">
                {props.types.join(" ")}
            </p>
        </div>
    </div>

    <p class="bg-black/40 p-2 mb-4">
        {props.description}
    </p>

    <div class="bg-black/40 p-2">
        {#each props.abilities as ability, idx}
            <!-- have top padding only for the titles -->
            {@const shouldPush = idx !== 0 && ability.textFormat === "TITLE"}

            {#if ability.textFormat === "TITLE"}
                <p
                    class="font-bold text-lg text-red-500 {shouldPush
                        ? 'pt-3'
                        : ''}"
                >
                    {ability.text}
                </p>
            {:else if ability.textFormat === "NORMAL"}
                <p>- {ability.text}</p>
            {:else if ability.textFormat === "SILENCE"}
                <p>× {ability.text}</p>
            {/if}
        {/each}
    </div>
</main>
