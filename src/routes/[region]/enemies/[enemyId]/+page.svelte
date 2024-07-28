<script>
    import ItemIcon from "$src/components/ItemIcon.svelte"
    import Richtext from "$src/components/Richtext.svelte"

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

    {#if props.description !== ""}
        <div class="bg-black/40 p-2 mb-4">
            <Richtext text={props.description} />
        </div>
    {/if}

    {#if props.tooltip !== ""}
        <div class="bg-black/40 p-2 mb-4">
            <Richtext text={props.tooltip} />
        </div>
    {/if}

    {#if props.abilities.length > 0}
        <div class="bg-black/40 p-2">
            {#each props.abilities as ability, idx}
                <!-- have top padding only for the titles -->
                {@const shouldPush =
                    idx !== 0 && ability.textFormat === "TITLE"}

                {#if ability.textFormat === "TITLE"}
                    <p
                        class="font-bold text-lg text-red-500 {shouldPush
                            ? 'pt-3'
                            : ''}"
                    >
                        {ability.text}
                    </p>
                {:else if ability.textFormat === "NORMAL"}
                    <Richtext text={`- ${ability.text}`} />
                {:else if ability.textFormat === "SILENCE"}
                    <Richtext text={`× ${ability.text}`} />
                {/if}
            {/each}
        </div>
    {/if}

    <!-- the entire thing below is horrible -->
    <!-- but it works, so alas... -->
    {#each props.levels as level, idx}
        <details class="mt-4 group border border-gray-400 bg-black/40">
            <summary class="p-2 group-open:border-b border-gray-400"
                >{`${props.strings.level} ${idx}`}</summary
            >

            <div class="p-2">
                <!-- attributes -->
                <table class="border w-full">
                    <tbody>
                        {#each Object.entries(level.attributes) as [attrKey, attrVal]}
                            <tr class="border">
                                <th class="border p-1 font-normal">{attrKey}</th
                                >
                                <td class="border p-1 font-normal">{attrVal}</td
                                >
                            </tr>
                        {/each}
                    </tbody>
                </table>

                <!-- talents -->
                <table class="border w-full mt-2">
                    <tbody>
                        {#each Object.values(level.talentBlackboard) as talent}
                            <tr class="border">
                                <th class="border p-1 font-normal"
                                    >{talent.key}</th
                                >
                                <td class="border p-1 font-normal"
                                    >{talent.valueStr || talent.value}</td
                                >
                            </tr>
                        {/each}
                    </tbody>
                </table>

                <!-- skills -->
                <table class="border w-full mt-2">
                    <tbody>
                        {#each Object.values(level.skills) as skill}
                            <tr>
                                <th colspan="2" class="border p-1 font-normal"
                                    >{skill.prefabKey}</th
                                >
                            </tr>

                            {#each Object.entries(skill) as [attrKey, attrVal]}
                                <tr class="border">
                                    <th class="border p-1 font-normal"
                                        >{attrKey}</th
                                    >
                                    <td class="border p-1 font-normal"
                                        >{attrVal}</td
                                    >
                                </tr>
                            {/each}
                        {/each}
                    </tbody>
                </table>
            </div>
        </details>
    {/each}
</main>
