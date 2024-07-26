import { SERVERS, IMAGE_CDN, ASSETS_BASE } from "$lib/constants"

import { Data, AvailableIcons, RaceData } from "$lib/logic/enemies"

export async function load({ params }) {
	const enemyData = Data[params.region][params.enemyId]

	const iconUrl = AvailableIcons.includes(enemyData.enemyId)
		? `${IMAGE_CDN}${ASSETS_BASE}/enemy/${enemyData.enemyId}.png`
		: "/missing.png"

	const types = []
	for (const type of Object.values(enemyData.enemyTypes)) {
		const typeData = RaceData[params.region][type]
		types.push(typeData.raceName)
	}

	return {
		name: enemyData.name,
		description: enemyData.description,
		iconUrl: iconUrl,
		abilities: enemyData.abilities,
		types: enemyData.enemyTypes,
	}
}

export async function entries() {
	const returns = []

	for (const region of SERVERS) {
		for (const enemy of Object.values(Data[region])) {
			returns.push({
				enemyId: enemy.enemyId,
				region: region,
			})
		}
	}

	return returns
}
