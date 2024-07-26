import { SERVERS, IMAGE_CDN, ASSETS_BASE } from "$lib/constants"
import { Data, AvailableIcons } from "$lib/logic/depot"

export async function load({ params }) {
	const itemData = Data[params.region][params.itemId]

	const iconUrl = AvailableIcons.includes(itemData.iconId)
		? `${IMAGE_CDN}${ASSETS_BASE}/items/${itemData.iconId}.png`
		: "/missing.png"

	return {
		name: itemData.name,
		description: itemData.description,
		usage: itemData.usage,

		itemId: itemData.itemId,
		iconUrl: iconUrl,
	}
}

export async function entries() {
	const returns = []

	for (const region of SERVERS) {
		for (const itemId of Object.keys(Data[region])) {
			returns.push({
				itemId: itemId,
				region: region,
			})
		}
	}

	return returns
}
