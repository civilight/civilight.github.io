import { DepotData } from "$lib/logic/depot"
import { GetRegionalString } from "$lib/utils"

import { SERVERS } from "$lib/constants"

export async function load({ params, parent }) {
	const item = DepotData.itemTable[params.itemId]

	return {
		name: GetRegionalString(item.name, params.lang),
		description: GetRegionalString(item.description, params.lang),
		usage: GetRegionalString(item.usage, params.lang),

		itemId: item.itemId,
		iconId: item.iconId,

		hasIcon: DepotData.availableIcons.includes(item.iconId),
	}
}

export async function entries() {
	const returns = []

	for (const lang of SERVERS) {
		for (const itemId of Object.keys(DepotData.itemTable)) {
			returns.push({
				itemId: itemId,
				lang: lang,
			})
		}
	}

	return returns
}
