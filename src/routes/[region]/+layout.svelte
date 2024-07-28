<script>
    import {base} from "$app/paths"

    const { children, data } = $props()
</script>

{#snippet link(text, destination)}
    <a 
        href={`${base}/${data.region}/${destination}`}
        class="grow h-full flex place-items-center place-content-center odd:bg-slate-600 hover:bg-slate-800"
    >
        <p>{text}</p>
    </a>
{/snippet}

<div class="h-12 bg-slate-700 w-full">
    <div class="w-full md:w-[50%] xl:w-[30%] h-full flex place-items-center m-auto">
        {@render link(data.strings.depot, "depot")}
        {@render link(data.strings.enemies, "enemies")}
        {@render link(data.strings.glossary, "glossary")}
    </div>
</div>

{@render children()}
