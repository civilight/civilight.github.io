import * as fs from "node:fs/promises"

import {
	GAMEDATA_PATH,
	ASSETS_REPO,
	ASSETS_BRANCH,
	SERVER_TO_LANGCODE_MAP,
	SERVERS,
} from "$lib/constants"

import type { GHTrees } from "$lib/types"

type RawEnemyInHandbookTable = {
	enemyId: string
	enemyIndex: string
	description: string
	sortId: number
	abilityList: { text: string; textFormat: string }[]
}

type RawHandbookTable = {
	enemyData: { [enemyId: string]: RawEnemyInHandbookTable }
	raceData: {
		[id: string]: {
			id: string
			raceName: string
			sortId: number
		}
	}
}

type RawDatabaseValue<T> = {
	m_defined: boolean
	m_value: T
}

type RawAttributes = {
	[key: string]: RawDatabaseValue<unknown>
}

type RawDatabaseTable = {
	enemies: {
		Key: string
		Value: {
			level: number
			enemyData: {
				name: RawDatabaseValue<string>
				description: RawDatabaseValue<string | undefined>

				lifePointReduce: RawDatabaseValue<number>

				enemyTags: RawDatabaseValue<string[] | undefined>
				attributes: RawAttributes
			}
		}[]
	}[]
}

type ParsedAttributes = {
	[key: string]: unknown
	lifePointReduce: number | undefined
}

type ParsedEnemyLevels = { attributes: ParsedAttributes }[]

type ParsedEnemy = {
	enemyId: string

	name: string
	description: string
	tooltip: string

	enemyTypes: string[]
	code: string
	sortId: number

	abilities: { text: string; textFormat: string }[]
	levels: ParsedEnemyLevels
}

type EnemiesTable = {
	[enemyId: string]: ParsedEnemy
}

export const Data: { [region: string]: EnemiesTable } = {}
export const RaceData: { [region: string]: { [id: string]: { id: string; raceName: string } } } = {}

for (const region of SERVERS) {
	const langCode = SERVER_TO_LANGCODE_MAP[region]
	Data[region] = {}

	const rawHandbook = JSON.parse(
		(
			await fs.readFile(
				`${GAMEDATA_PATH}/${langCode}/gamedata/excel/enemy_handbook_table.json`,
			)
		).toString(),
	) as RawHandbookTable

	const rawTable = JSON.parse(
		(
			await fs.readFile(
				`${GAMEDATA_PATH}/${langCode}/gamedata/levels/enemydata/enemy_database.json`,
			)
		).toString(),
	) as RawDatabaseTable

	RaceData[region] = rawHandbook.raceData

	const largestSortId = Object.values(rawHandbook.enemyData).reduce((accumulated, curr) => {
		if (curr.sortId > accumulated.sortId) {
			return curr
		}

		return accumulated
	}).sortId

	for (const [idx, rawEnemyData] of Object.entries(rawTable.enemies)) {
		const rawHandbookEnemy = rawHandbook.enemyData[rawEnemyData.Key] || {
			enemyIndex: "",
			sortId: Number.parseInt(idx) + largestSortId,
			abilityList: [],
		}

		const levels: ParsedEnemyLevels = []

		for (const rawLevel of rawEnemyData.Value) {
			const attributes: ParsedAttributes = {
				lifePointReduce: rawLevel.enemyData.lifePointReduce.m_defined
					? rawLevel.enemyData.lifePointReduce.m_value
					: undefined,
			}

			for (const [attrKey, attrVal] of Object.entries(rawLevel.enemyData.attributes)) {
				if (attrVal.m_defined) {
					attributes[attrKey] = attrVal.m_value
				}
			}

			levels.push({
				attributes: attributes,
			})
		}

		Data[region][rawEnemyData.Key] = {
			enemyId: rawEnemyData.Key,

			name: rawEnemyData.Value[0].enemyData.name.m_value,
			description: rawHandbookEnemy.description || "",
			tooltip: rawEnemyData.Value[0].enemyData.description.m_value || "",

			enemyTypes: rawEnemyData.Value[0].enemyData.enemyTags.m_value || [],
			code: rawHandbookEnemy.enemyIndex,
			sortId: rawHandbookEnemy.sortId,

			abilities: rawHandbookEnemy.abilityList,
			levels: levels,
		}
	}
}

// fetch all the files from GitHub to determine which item has an icon and which
// doesn't, so we can display it accordingly in the HTML
const ghTrees = (await (
	await fetch(`https://api.github.com/repos/${ASSETS_REPO}/git/trees/${ASSETS_BRANCH}`)
).json()) as GHTrees

const enemies = ghTrees.tree.find((predicate) => predicate.path === "enemy")
if (!enemies) {
	throw new Error("no 'enemy' tree found")
}

const enemiesTree = (await (await fetch(enemies.url)).json()) as GHTrees
const rawTable = JSON.parse(
	(
		await fs.readFile(`${GAMEDATA_PATH}/zh_CN/gamedata/levels/enemydata/enemy_database.json`)
	).toString(),
) as RawDatabaseTable

export const AvailableIcons = Object.values(rawTable.enemies)
	.filter((v) => {
		return enemiesTree.tree.find((p) => p.path === `${v.Key}.png`)
	})
	.map((v) => v.Key)
