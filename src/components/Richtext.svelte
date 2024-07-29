<script lang="ts">
	import { EscapeNonHTMLRichtext, ParseRichtextToNodes } from "$lib/logic/richtext"

	import { base } from "$app/paths"
	import { page } from "$app/stores" // do not ever use this component outside of [region] layout

	import type { BlackboardEntry } from "$lib/types"

	const ColorRegex = /<color=(.*?)>\{0}/gm
	const BlackboardVarRegex = /{(.+)}/gm

	type Props = {
		text: string
		blackboard?: BlackboardEntry[]
	}

	const { text, blackboard }: Props = $props()
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
				effectKey: ""
			}
			let text = rawNode.text

			// replace variables in the text
			if (blackboard) {
				const matches = [...text.matchAll(BlackboardVarRegex)]

				for (const match of matches) {
					const entireMatch = match[0]
					const varGroup = match[1]

					// simple var substitution
					const blackboardEntry = blackboard.find((v) => v.key === varGroup)
					if (blackboardEntry) {
						text = text.replace(
							entireMatch,
							blackboardEntry.valueStr || blackboardEntry.value.toString()
						)
					} else {
						// more complex var substitution
						let [varName, varFormat] = varGroup.split(":")
						let negateValue = false

						if (varName.indexOf("-") === 0) {
							negateValue = true
							varName = varName.slice(1)
						}

						const blackboardEntry = blackboard.find(
							(v) => v.key === varName.toLowerCase()
						)

						if (!blackboardEntry) continue // hmmm...

						let value = blackboardEntry.value
						if (negateValue) {
							value = -value
						}

						if (varFormat === "0%") {
							// format as percentage
							text = text.replace(
								entireMatch,
								value.toLocaleString(undefined, {
									style: "percent"
								})
							)
						} else if (varFormat === "0.0%") {
							// format as percentage with 1 trailing zero
							text = text.replace(
								entireMatch,
								value.toLocaleString(undefined, {
									style: "percent",
									minimumFractionDigits: 1
								})
							)
						}
					}
				}
			}

			returns.push(newNode)
			newNode.text = text

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
					const termDesc = data.termDescriptionDict[formatter.slice(1)].description

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
