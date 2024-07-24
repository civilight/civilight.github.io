import { SERVERS, IMAGE_CDN, ASSETS_BASE } from "$lib/constants"

import { EnemyData } from "$lib/logic/enemies"
import { GetRegionalString } from "$lib/utils"

export async function load({ params }) {
	// biome-ignore lint/style/noNonNullAssertion: infallible
	const data = Object.values(EnemyData.enemies).find((v) => v.enemyId === params.enemyId)!

	const name = GetRegionalString(data.name, params.lang)
	const description = GetRegionalString(data.description, params.lang)

	const iconUrl = EnemyData.availableIcons.includes(params.enemyId)
		? `${IMAGE_CDN}${ASSETS_BASE}/enemy/${data.enemyId}.png`
		: "/missing.png"

	// WTF: we use Object.values() here because the data may contain some empty
	// dictionaries. This is due to Lua being fucky and couldn't serialize
	// empty tables into empty JSON arrays, but into empty dicts instead
	// Therefore, use Object.values() to pretend that everything is an array
	const abilities = []
	for (const ogAbility of Object.values(data.abilities)) {
		abilities.push({
			textFormat: ogAbility.textFormat,
			text: GetRegionalString(ogAbility.text, params.lang),
		})
	}

	// TODO: sort types here (probably unnecessary since no enemy has more than 1 type?)
	// WTF: see the WTF above
	const types = []
	for (const type of Object.values(data.enemyTypes)) {
		// biome-ignore lint/style/noNonNullAssertion: infallible
		const typeData = EnemyData.enemyTypes.find((v) => v.id === type)!
		types.push(GetRegionalString(typeData.raceName, params.lang))
	}

	return {
		name: name,
		description: description,
		iconUrl: iconUrl,
		abilities: abilities,
		types: types,
	}
}

export async function entries() {
	const returns = []

	for (const lang of SERVERS) {
		for (const enemy of Object.values(EnemyData.enemies)) {
			if (enemy.appearsInHandbook) {
				returns.push({
					enemyId: enemy.enemyId,
					lang: lang,
				})
			}
		}
	}

	return returns
}
