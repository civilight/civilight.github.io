import * as fs from "node:fs/promises"

import {
	GAMEDATA_PATH,
	ASSETS_REPO,
	SERVER_TO_LANGCODE_MAP,
	SERVERS,
	ASSETS_PATH
} from "$lib/constants"

import type { GHContent, GHTrees } from "$lib/types"
import { fetchWithAuth } from "$lib/utils"

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
				talentBlackboard: TalentBlackboard[] | undefined
				skills: RawSkill[] | undefined
			}
		}[]
	}[]
}

type ParsedAttributes = {
	[key: string]: unknown
	lifePointReduce: number | undefined
}

type TalentBlackboard = {
	key: string
	value: unknown | undefined
	valueStr: unknown | undefined
}

type RawSkill = {
	prefabKey: string
	priority: number
	cooldown: number
	initCooldown: number
	spCost: number
	blackboard: TalentBlackboard[] | undefined
}

type ParsedSkill = {
	prefabKey: string
	[key: string]: unknown
}

type ParsedEnemyLevels = {
	attributes: ParsedAttributes
	talentBlackboard: TalentBlackboard[]
	skills: ParsedSkill[]
}[]

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
				`${GAMEDATA_PATH}/${langCode}/gamedata/excel/enemy_handbook_table.json`
			)
		).toString()
	) as RawHandbookTable

	const rawTable = JSON.parse(
		(
			await fs.readFile(
				`${GAMEDATA_PATH}/${langCode}/gamedata/levels/enemydata/enemy_database.json`
			)
		).toString()
	) as RawDatabaseTable

	RaceData[region] = rawHandbook.raceData

	const largestSortId = Math.max(...Object.values(rawHandbook.enemyData).map((v) => v.sortId))

	for (const [idx, rawEnemyData] of Object.entries(rawTable.enemies)) {
		const rawHandbookEnemy = rawHandbook.enemyData[rawEnemyData.Key] || {
			enemyIndex: "",
			sortId: Number.parseInt(idx) + largestSortId,
			abilityList: []
		}

		const levels: ParsedEnemyLevels = []
		const rawLevel0 = rawEnemyData.Value[0]

		for (const rawLevel of rawEnemyData.Value) {
			const attributes: ParsedAttributes = {
				lifePointReduce: rawLevel.enemyData.lifePointReduce.m_defined
					? rawLevel.enemyData.lifePointReduce.m_value
					: rawLevel0.enemyData.lifePointReduce.m_value
			}

			for (const [attrKey, attrVal] of Object.entries(rawLevel.enemyData.attributes)) {
				if (attrVal.m_defined) {
					attributes[attrKey] = attrVal.m_value
				} else {
					attributes[attrKey] = rawLevel0.enemyData.attributes[attrKey].m_value
				}
			}

			const rawSkills = rawLevel.enemyData.skills || []
			const parsedSkills: ParsedSkill[] = []

			for (const rawSkill of rawSkills) {
				const parsedSkill: ParsedSkill = {
					prefabKey: rawSkill.prefabKey,
					priority: rawSkill.priority,
					cooldown: rawSkill.cooldown,
					initCooldown: rawSkill.initCooldown,
					spCost: rawSkill.spCost
				}

				if (rawSkill.blackboard) {
					for (const blackboard of rawSkill.blackboard) {
						parsedSkill[blackboard.key] = blackboard.valueStr || blackboard.value
					}
				}

				parsedSkills.push(parsedSkill)
			}

			levels.push({
				attributes: attributes,
				talentBlackboard: rawLevel.enemyData.talentBlackboard || [],
				skills: parsedSkills
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
			levels: levels
		}
	}
}

// fetch enemy icons
export const IconPaths: { [k: string]: string } = {}

{
	const response = (await (
		await fetchWithAuth(
			`https://api.github.com/repos/${ASSETS_REPO}/contents/${ASSETS_PATH}/arts`
		)
	).json()) as GHContent[]

	const sha = response.find((v) => v.name === "enemies")?.sha

	const tree = (await (
		await fetchWithAuth(
			`https://api.github.com/repos/${ASSETS_REPO}/git/trees/${sha}?recursive=1`
		)
	).json()) as GHTrees

	for (const branch of tree.tree) {
		const fileName = branch.path.slice(0, -4)
		IconPaths[fileName] = `arts/enemies/${branch.path}`
	}
}
