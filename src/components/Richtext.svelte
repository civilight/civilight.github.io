<script lang="ts">
    import {
        EscapeNonHTMLRichtext,
        ParseRichtextToNodes,
    } from "$lib/logic/richtext"

    // importing a type from server is fine i suppose
    import type { LocalizedRichtextData } from "$lib/server/richtext"

    const ColorRegex = /<color=(.*?)>\{0}/gm

    type Props = {
        text: string
        data: LocalizedRichtextData
        ignoreFormatters?: boolean
    }

    const { text, data, ignoreFormatters = false }: Props = $props()

    const rawNodes = $derived(ParseRichtextToNodes(text))
    const nodes = $derived.by(() => {
        const returns = []

        for (const rawNode of rawNodes) {
            const newNode = { text: "", class: "", style: "", title: "" }
            returns.push(newNode)
            newNode.text = rawNode.text

            if (ignoreFormatters) continue

            for (const formatter of rawNode.formatters) {
                console.log(formatter)

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
                }
            }
        }

        return returns
    })
</script>

<div>
    {#each nodes as node}
        <span class={node.class} title={node.title} style={node.style}
            >{@html EscapeNonHTMLRichtext(node.text)}</span
        >
    {/each}
</div>
