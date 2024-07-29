import { SERVERS, IMAGE_CDN, ASSETS_BASE } from "$lib/constants"
import { Data, IconPaths } from "$lib/logic/depot"

export async function load({ params }) {
	const itemData = Data[params.region][params.itemId]

	const iconPath = IconPaths[itemData.iconId]
	const iconUrl = iconPath ? `${IMAGE_CDN}${ASSETS_BASE}/${iconPath}` : "/missing.png"

	return {
		name: itemData.name,
		description: itemData.description,
		usage: itemData.usage,
		rarity: itemData.rarity,

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
