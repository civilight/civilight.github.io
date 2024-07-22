import { GetDepotData } from "$lib/depot"
import { GetRegionalString } from "$lib/utils.js"

import { SERVERS } from "$lib/constants.js"

const ItemData = await GetDepotData()

export async function load({ params, parent }) {
	console.log(`[Depot] Building ${params.itemId}`)

	const item = ItemData.itemTable[params.itemId]

	return {
		name: GetRegionalString(item.name, params.lang),
		description: GetRegionalString(item.description, params.lang),
		usage: GetRegionalString(item.usage, params.lang),

		itemId: item.itemId,
		iconId: item.iconId,

		hasIcon: ItemData.availableIcons.includes(item.iconId),
	}
}

export async function entries() {
	const returns = []

	for (const lang of SERVERS) {
		for (const itemId of Object.keys(ItemData.itemTable)) {
			returns.push({
				itemId: itemId,
				lang: lang,
			})
		}
	}

	return returns
}
