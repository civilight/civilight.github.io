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
	sortId: number
	abilityList: { text: string; textFormat: string }[]
}

type RawEnemyHandbook = {
	enemyData: { [enemyId: string]: RawEnemyInHandbookTable }
	raceData: {
		[id: string]: {
			id: string
			raceName: string
			sortId: number
		}
	}
}

type EnemyDatabaseValue<T> = {
	m_defined: boolean
	m_value: T
}

type RawEnemyDatabase = {
	enemies: {
		Key: string
		Value: {
			level: number
			enemyData: {
				name: EnemyDatabaseValue<string>
				description: EnemyDatabaseValue<string | undefined>
				enemyTags: EnemyDatabaseValue<string[] | undefined>
			}
		}[]
	}[]
}

type ParsedEnemy = {
	enemyId: string
	name: string
	description: string
	enemyTypes: string[]
	code: string
	sortId: number
	abilities: { text: string; textFormat: string }[]
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
	) as RawEnemyHandbook

	const rawTable = JSON.parse(
		(
			await fs.readFile(
				`${GAMEDATA_PATH}/${langCode}/gamedata/levels/enemydata/enemy_database.json`,
			)
		).toString(),
	) as RawEnemyDatabase

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

		Data[region][rawEnemyData.Key] = {
			enemyId: rawEnemyData.Key,

			name: rawEnemyData.Value[0].enemyData.name.m_value,
			description: rawEnemyData.Value[0].enemyData.description.m_value || "",
			enemyTypes: rawEnemyData.Value[0].enemyData.enemyTags.m_value || [],

			code: rawHandbookEnemy.enemyIndex,
			sortId: rawHandbookEnemy.sortId,
			abilities: rawHandbookEnemy.abilityList,
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
) as RawEnemyDatabase

export const AvailableIcons = Object.values(rawTable.enemies)
	.filter((v) => {
		return enemiesTree.tree.find((p) => p.path === `${v.Key}.png`)
	})
	.map((v) => v.Key)
