import { XMLParser } from "fast-xml-parser"

const UltimateRegex = /(?<=<)([^>\$&\.\/\\]+)(?=>)/gmu

type RichtextNode = {
	text: string
	formatters: string[]
}

export function EscapeNonHTMLRichtext(text: string): string {
	const matches = [...text.matchAll(UltimateRegex)]
	let cleanedText = text

	for (const match of matches) {
		cleanedText = cleanedText.replace(`<${match[0]}>`, `&lt;${match[0]}&gt;`)
	}

	return cleanedText
}

export function ParseRichtextToNodes(text: string): RichtextNode[] {
	const parser = new XMLParser({
		preserveOrder: true,
		alwaysCreateTextNode: true,
		trimValues: false,
		parseAttributeValue: false,
		parseTagValue: false,
	})

	const nodes: RichtextNode[] = []
	const obj = parser.parse(`<root>${EscapeNonHTMLRichtext(text)}</root>`)

	// biome-ignore lint/suspicious/noExplicitAny: too lazy to type lol
	function parseNode(root: any, parentNodeData: RichtextNode | undefined) {
		const key = Object.keys(root)[0]
		const value = root[key]
		const nodeData: RichtextNode = structuredClone(
			parentNodeData || {
				text: "",
				formatters: [],
			},
		)

		if (key === "#text") {
			// just text content, pass
			nodeData.text = value
			nodes.push(nodeData)
		} else {
			// recurse
			const isValidKey = key.indexOf("@") === 0 || key.indexOf("$") === 0

			if (isValidKey) {
				nodeData.formatters.push(key)

				for (const subNode of value) {
					parseNode(subNode, nodeData)
				}
			} else if (key === "i") {
				// HARDCODING FTW
				// this appears in Lumen's second module 'Luck'
				nodeData.formatters.push("@cc.pn")

				for (const subNode of value) {
					parseNode(subNode, nodeData)
				}
			} else {
				nodeData.text = `<${key}>`
				nodes.push(nodeData)

				for (const subNode of value) {
					parseNode(subNode, nodeData)
				}
			}
		}
	}

	for (const node of obj[0].root) {
		parseNode(node, undefined)
	}

	return nodes
}
