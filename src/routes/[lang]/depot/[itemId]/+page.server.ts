import { ParseData } from "$lib/depot.js"
import { SERVERS } from "$lib/constants.js"

const ItemData = await ParseData()

export async function load({ params, parent }) {
	console.log(`[Depot] Building ${params.itemId}`)

	const item = ItemData.itemTable[params.itemId]

	return {
		itemData: item,
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