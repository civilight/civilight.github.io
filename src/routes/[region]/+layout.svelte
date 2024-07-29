<script>
    import { base } from "$app/paths"

    const { children, data } = $props()
</script>

{#snippet link(text, destination)}
    <a 
        href="{base}/{data.region}/{destination}"
        class="grow h-full center-children odd:bg-slate-600 hover:bg-slate-800"
    >
        <p>{text}</p>
    </a>
{/snippet}

<div class="h-10 bg-slate-700 text-gray-200 w-full fixed z-10">
    <div class="w-full md:w-[50%] xl:w-[30%] h-full center-children m-auto">
        {@render link(data.strings.depot, "depot")}
        {@render link(data.strings.enemies, "enemies")}
        {@render link(data.strings.operators, "operators")}
        {@render link(data.strings.glossary, "glossary")}
    </div>
</div>

<div class="min-w-dvw min-h-dvh bg-gray-800 text-gray-200 pt-10">
    {@render children()}
</div>
