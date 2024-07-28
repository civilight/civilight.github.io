<script lang="ts">
    import {
        EscapeNonHTMLRichtext,
        ParseRichtextToNodes,
    } from "$lib/logic/richtext"

    import { base } from "$app/paths"
    import { page } from "$app/stores" // do not ever use this component outside of [region] layout

    const ColorRegex = /<color=(.*?)>\{0}/gm

    type Props = {
        text: string
    }

    const { text }: Props = $props()
    const data = $page.data.richtextTable

    const rawNodes = $derived(ParseRichtextToNodes(text))
    const nodes = $derived.by(() => {
        const returns = []

        for (const rawNode of rawNodes) {
            const newNode = {
                text: "",
                class: "whitespace-pre-line ",
                style: "",
                title: "",
                isGlossary: false,
                effectKey: "",
            }
            returns.push(newNode)
            newNode.text = rawNode.text

            for (const formatter of rawNode.formatters) {
                if (formatter.at(0) === "@") {
                    const styleText = data.richTextStyles[formatter.slice(1)]
                    const matches = [...styleText.matchAll(ColorRegex)]

                    if (matches.length > 0) {
                        // this is a color style
                        newNode.style += `color: ${matches[0][1]};`
                    } else {
                        // replace the text
                        newNode.text = styleText.replace("{0}", newNode.text)
                    }
                } else {
                    const termDesc =
                        data.termDescriptionDict[formatter.slice(1)].description

                    const effectNodes = ParseRichtextToNodes(termDesc)
                    const effectTitle = effectNodes
                        .map((v) => v.text)
                        .reduce((accu, curr) => accu + curr)

                    newNode.title = effectTitle
                    newNode.class += "underline text-red-200"
                    newNode.isGlossary = true
                    newNode.effectKey = formatter.slice(1)
                }
            }
        }

        return returns
    })
</script>

<div>
    {#each nodes as node}
        {#if node.isGlossary}
            <a
                href={`${base}/${$page.data.region}/glossary#${node.effectKey}`}
                class={node.class}
                title={node.title}
                style={node.style}>{@html EscapeNonHTMLRichtext(node.text)}</a
            >
        {:else}
            <span class={node.class} title={node.title} style={node.style}
                >{@html EscapeNonHTMLRichtext(node.text)}</span
            >
        {/if}
    {/each}
</div>
