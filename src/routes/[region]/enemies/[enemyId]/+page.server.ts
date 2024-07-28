import { SERVERS, IMAGE_CDN, ASSETS_BASE } from "$lib/constants"

import { Data, IconPaths, RaceData } from "$lib/logic/enemies"

export async function load({ params }) {
	const enemyData = Data[params.region][params.enemyId]

	const iconPath = IconPaths[enemyData.enemyId]
	const iconUrl = iconPath ? `${IMAGE_CDN}${ASSETS_BASE}/${iconPath}` : "/missing.png"

	const types = []
	for (const type of Object.values(enemyData.enemyTypes)) {
		const typeData = RaceData[params.region][type]
		types.push(typeData.raceName)
	}

	return {
		name: enemyData.name,
		description: enemyData.description,
		tooltip: enemyData.tooltip,

		abilities: enemyData.abilities,
		levels: enemyData.levels,

		iconUrl: iconUrl,
		types: types,
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
