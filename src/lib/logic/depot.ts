import * as fs from "node:fs/promises"

import {
	GAMEDATA_PATH,
	ASSETS_REPO,
	ASSETS_BRANCH,
	SERVER_TO_LANGCODE_MAP,
	SERVERS,
} from "$lib/constants"

import type { GHTrees } from "$lib/types"

type RawItemTable = {
	items: {
		[itemId: string]: {
			itemId: string
			iconId: string
			sortId: number

			name: string
			description: string
			usage: string
		}
	}
}

type ParsedItem = {
	itemId: string
	iconId: string
	sortId: number

	name: string
	description: string
	usage: string
}

type ItemTable = {
	[itemId: string]: ParsedItem
}

export const Data: { [region: string]: ItemTable } = {}

for (const region of SERVERS) {
	const langCode = SERVER_TO_LANGCODE_MAP[region]
	Data[region] = {}

	const rawTable = JSON.parse(
		(
			await fs.readFile(`${GAMEDATA_PATH}/${langCode}/gamedata/excel/item_table.json`)
		).toString(),
	) as RawItemTable

	for (const rawItem of Object.values(rawTable.items)) {
		Data[region][rawItem.itemId] = rawItem
	}
}

// fetch all the files from GitHub to determine which item has an icon and which
// doesn't, so we can display it accordingly in the HTML
const ghTrees = (await (
	await fetch(`https://api.github.com/repos/${ASSETS_REPO}/git/trees/${ASSETS_BRANCH}`)
).json()) as GHTrees

const items = ghTrees.tree.find((predicate) => predicate.path === "items")
if (!items) {
	throw new Error("no 'items' tree found")
}

const itemsTree = (await (await fetch(items.url)).json()) as GHTrees
const rawTable = JSON.parse(
	(await fs.readFile(`${GAMEDATA_PATH}/zh_CN/gamedata/excel/item_table.json`)).toString(),
) as RawItemTable

export const AvailableIcons = Object.values(rawTable.items)
	.filter((v) => {
		return itemsTree.tree.find((p) => p.path.includes(v.iconId))
	})
	.map((v) => v.iconId)
