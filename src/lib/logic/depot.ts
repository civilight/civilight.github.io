import * as fs from "node:fs/promises"

import { ASSETS_BRANCH, ASSETS_REPO, GAMEDATA_PATH } from "$lib/constants"

import type { RegionalStrings, GHTrees } from "$lib/types"
import { error } from "@sveltejs/kit"

type ItemTable = {
	[itemId: string]: {
		itemId: string
		rarity: string
		iconId: string
		sortId: number

		name: RegionalStrings
		description: RegionalStrings
		usage: RegionalStrings
	}
}

type DepotResponse = {
	itemTable: ItemTable
	availableIcons: string[]
}

let _cached: DepotResponse

export async function GetDepotData(): Promise<DepotResponse> {
	if (_cached !== undefined) {
		return _cached
	}

	const contents = await fs.readFile(`${GAMEDATA_PATH}/item_table.json`)
	const itemTable = JSON.parse(contents.toString()) as ItemTable

	// fetch all the files from GitHub to determine which item has an icon and which
	// doesn't, so we can display it accordingly in the HTML
	const ghTrees = (await (
		await fetch(`https://api.github.com/repos/${ASSETS_REPO}/git/trees/${ASSETS_BRANCH}`)
	).json()) as GHTrees

	const items = ghTrees.tree.find((predicate) => predicate.path === "items")
	if (!items) {
		error(500, "no 'items' tree found")
	}

	const itemsTree = (await (await fetch(items.url)).json()) as GHTrees

	// construct response
	const response = {} as DepotResponse

	response.itemTable = itemTable
	response.availableIcons = Object.values(itemTable)
		.filter((item) => {
			return itemsTree.tree.find((predicate) => predicate.path === `${item.iconId}.png`)
		})
		.map((thing) => thing.iconId)

	_cached = response

	return response
}