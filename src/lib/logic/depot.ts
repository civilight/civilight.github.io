import * as fs from "node:fs/promises"

import {
	GAMEDATA_PATH,
	ASSETS_REPO,
	SERVER_TO_LANGCODE_MAP,
	SERVERS,
	ASSETS_PATH,
} from "$lib/constants"

import type { GHContent, GHTrees } from "$lib/types"
import { fetchWithAuth } from "$lib/utils"

type RawItemTable = {
	items: {
		[itemId: string]: {
			itemId: string
			iconId: string
			sortId: number
			rarity: string

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
	rarity: string

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

// item icons are scattered across the repo, so...
export const IconPaths: { [k: string]: string } = {}

{
	const response = (await (
		await fetchWithAuth(
			`https://api.github.com/repos/${ASSETS_REPO}/contents/${ASSETS_PATH}/arts/items`,
		)
	).json()) as GHContent[]

	const sha = response.find((v) => v.name === "icons")?.sha

	const tree = (await (
		await fetchWithAuth(
			`https://api.github.com/repos/${ASSETS_REPO}/git/trees/${sha}?recursive=1`,
		)
	).json()) as GHTrees

	for (const branch of tree.tree) {
		const filePath = branch.path.slice(0, -4)
		const fileName = filePath.split("/").at(-1) || ""

		IconPaths[fileName] = `arts/items/icons/${branch.path}`
	}
}

{
	const response = (await (
		await fetchWithAuth(
			`https://api.github.com/repos/${ASSETS_REPO}/contents/${ASSETS_PATH}/activity/commonassets/`,
		)
	).json()) as GHContent[]

	const sha = response.find((v) => v.name === "[uc]items")?.sha

	const tree = (await (
		await fetchWithAuth(
			`https://api.github.com/repos/${ASSETS_REPO}/git/trees/${sha}?recursive=1`,
		)
	).json()) as GHTrees

	for (const branch of tree.tree) {
		const filePath = branch.path.slice(0, -4)
		const fileName = filePath.split("/").at(-1) || ""

		IconPaths[fileName] = `activity/commonassets/[uc]items/${branch.path}`
	}
}
