<script>
    import ItemIcon from "$src/components/ItemIcon.svelte"
    import Richtext from "$src/components/Richtext.svelte"

    const { data: props } = $props()
</script>

<svelte:head>
    <title>{props.name}</title>
</svelte:head>

{#snippet richtext(text)}
    <Richtext {text} data={props.richtextTable} />
{/snippet}

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
    
    <div class="bg-black/40 p-2 mb-4">
        {@render richtext(props.description)}

        <div class="italic mt-3">
            {@render richtext(props.tooltip)}
        </div>
    </div>
    
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
                {@render richtext(`- ${ability.text}`)}
            {:else if ability.textFormat === "SILENCE"}
                {@render richtext(`× ${ability.text}`)}
            {/if}
        {/each}
    </div>

    <!-- this is horrible -->
    {#each props.levels as level, idx}
        <div class="mt-4">
            <details class="group border border-gray-400 bg-black/40"> 
                <summary class="p-2 group-open:border-b border-gray-400">{`Level ${idx}`}</summary>
                <div class="p-2">
                    <table class="border w-full">
                        <tbody>
                            {#each Object.entries(level.attributes) as [attrKey, attrVal]}
                                <tr class="border">
                                    <th class="border p-1 font-normal">{attrKey}</th>
                                    <th class="border p-1 font-normal">{attrVal}</th>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </details>
        </div>
    {/each}
</main>
