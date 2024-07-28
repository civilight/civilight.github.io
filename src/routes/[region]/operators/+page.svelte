<script lang="ts">
    import { ASSETS_BASE } from "$lib/constants"

    const { data } = $props()

    const rarityToNumberMap: { [key: string]: number } = {
        TIER_6: 6,
        TIER_5: 5,
        TIER_4: 4,
        TIER_3: 3,
        TIER_2: 2,
        TIER_1: 1,
    }

    const rarityToColorMap: { [key: string]: string } = {
        TIER_6: "bg-orange-400",
        TIER_5: "bg-yellow-200",
        TIER_4: "bg-violet-200",
        TIER_3: "bg-blue-500",
        TIER_2: "bg-lime-300",
        TIER_1: "bg-neutral-100",
    }

    // sort by name alphabetically, as well as higher rarity first
    const charTable = Object.values(data.charTable).sort((a, b) => {
        // prioritize comparing appellation (they are in English (mostly (Pozemka is weird)))
        const toCompareA = a.appellation !== "" ? a.appellation : a.name
        const toCompareB = b.appellation !== "" ? b.appellation : b.name

        return (
            rarityToNumberMap[b.rarity] - rarityToNumberMap[a.rarity] ||
            toCompareA.localeCompare(toCompareB)
        )
    })
</script>

<svelte:head>
    <title>{data.strings.operators}</title>
</svelte:head>

<main class="max-w-3xl m-auto p-3 grid grid-cols-4 lg:grid-cols-6 gap-2">
    {#each charTable as charData}
        <div
            class="{rarityToColorMap[
                charData.rarity
            ]} relative aspect-[9/16] overflow-hidden"
        >
            <div
                class="absolute w-full h-full bg-gradient-to-b from-black/20 to-black/90"
            ></div>

            <div class="absolute bottom-0 w-full p-2">
                {#if charData.appellation !== ""}
                    <p>{charData.appellation}</p>
                {/if}

                <p class="font-bold">{charData.name}</p>
            </div>

            <div
                class="absolute right-0 bg-black p-2 w-10 h-10 flex place-items-center place-content-center"
            >
                <img
                    src="{ASSETS_BASE}/arts/ui/subprofessionicon/sub_{charData.subProfession}_icon.png"
                    alt="Icon of sub profession"
                    class="w-full h-auto"
                />
            </div>

            <img
                src="{ASSETS_BASE}/arts/charportraits/{charData.charId}_1.png"
                alt="Portrait of {charData.name}"
            />
        </div>
    {/each}
</main>
