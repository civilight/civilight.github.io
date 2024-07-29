import * as fs from "node:fs/promises"

import {
	GAMEDATA_PATH,
	ASSETS_REPO,
	ASSETS_BRANCH,
	SERVER_TO_LANGCODE_MAP,
	SERVERS
} from "$lib/constants"

import type { BlackboardEntry } from "$lib/types"

type PhaseData = {
	phase: string
	level: number
}

type Item = {
	id: string
	count: number
}

type RawSkillMasteryData = {
	unlockCond: PhaseData
	levelUpCost: Item[] | undefined
}

type RawCharSkill = {
	skillId: string
	levelUpCostCond: RawSkillMasteryData[]
}

type RawCharTrait = {
	unlockCondition: PhaseData
	requiredPotentialRank: number
	blackboard: BlackboardEntry[] | undefined
	overrideDescripton: string | undefined // true HG fashion typo
}

type RawCharTalent = {
	name: string
	description: string

	unlockCondition: PhaseData
	requiredPotentialRank: number

	blackboard: BlackboardEntry[] | undefined
	isHideTalent: boolean
}

type RawCharacter = {
	rarity: string

	name: string | undefined
	description: string | undefined
	appellation: string | undefined

	displayNumber: string | undefined
	itemUsage: string | undefined
	itemDesc: string | undefined

	profession: string
	subProfessionId: string

	skills: RawCharSkill[]
	trait: { candidates: RawCharTrait[] } | undefined
	talents: { candidates: RawCharTalent[] }[] | undefined
}

type RawCharacterTable = { [id: string]: RawCharacter }

type RawSkillLevel = {
	name: string
	description: string

	duration: number
	spData: {
		spCost: number
		initSp: number
	}

	blackboard: BlackboardEntry[]
}

type RawSkillData = {
	skillId: string
	iconId: string | undefined
	levels: RawSkillLevel[]
}

type RawSkillTable = { [skillId: string]: RawSkillData }

export type ParsedSkill = {
	skillId: string
	iconPath: string
	name: string

	levels: RawSkillLevel[]
	masteryCosts: RawSkillMasteryData[]
}

type ParsedTrait = {
	unlockCondition: PhaseData
	requiredPotentialRank: number
	blackboard: BlackboardEntry[] | undefined
	description: string
}

type ParsedTalent = {
	name: string
	candidates: RawCharTalent[]
}

type ParsedCharacter = {
	charId: string
	rarity: string

	name: string
	appellation: string

	code: string
	description: string
	flavorText: string

	profession: string
	subProfession: string

	skills: ParsedSkill[]
	traits: ParsedTrait[]
	talents: ParsedTalent[]
}

type CharacterTable = { [id: string]: ParsedCharacter }

const GenericSkillRegex = /\[\d\]/gm

export const Data: { [region: string]: CharacterTable } = {}

for (const region of SERVERS) {
	const langCode = SERVER_TO_LANGCODE_MAP[region]
	Data[region] = {}

	const rawCharTable = JSON.parse(
		(
			await fs.readFile(`${GAMEDATA_PATH}/${langCode}/gamedata/excel/character_table.json`)
		).toString()
	) as RawCharacterTable

	const RawSkillTable = JSON.parse(
		(
			await fs.readFile(`${GAMEDATA_PATH}/${langCode}/gamedata/excel/skill_table.json`)
		).toString()
	) as RawSkillTable

	for (const [charId, rawChar] of Object.entries(rawCharTable)) {
		if (rawChar.subProfessionId.includes("notchar") || rawChar.profession === "TOKEN") continue
		if (charId === "char_512_aprot") continue // why is there a duplicate Shalem

		// parse skills
		const skills: ParsedSkill[] = []

		{
			for (const rawCharSkill of rawChar.skills) {
				const rawSkillData = RawSkillTable[rawCharSkill.skillId]
				const iconId = rawSkillData.iconId || rawSkillData.skillId
				const isGenericSkill = iconId.match(GenericSkillRegex) !== null

				// i am being held hostage by the assets repo
				const iconPath = isGenericSkill
					? `skill_icon_${iconId}/skill_icon_${iconId}.png/skill_icon_${iconId}.png`
					: `skill_icon_${iconId}.png`

				skills.push({
					skillId: rawCharSkill.skillId,
					iconPath: iconPath,
					name: rawSkillData.levels[0].name,

					levels: rawSkillData.levels,
					masteryCosts: rawCharSkill.levelUpCostCond
				})
			}
		}

		// parse traits
		const traits: ParsedTrait[] = []

		{
			if (rawChar.trait) {
				for (const candidate of rawChar.trait.candidates) {
					const parsedTrait: ParsedTrait = {
						description: candidate.overrideDescripton || rawChar.description || "",
						blackboard: candidate.blackboard,
						requiredPotentialRank: candidate.requiredPotentialRank,
						unlockCondition: candidate.unlockCondition
					}

					traits.push(parsedTrait)
				}
			} else {
				traits.push({
					description: rawChar.description || "",
					blackboard: undefined,
					requiredPotentialRank: 0,
					unlockCondition: {
						phase: "PHASE_0",
						level: 1
					}
				})
			}
		}

		// parse talents
		let talents: ParsedTalent[] = []

		{
			if (rawChar.talents) {
				for (const rawTalent of rawChar.talents) {
					// why does Ulpianus have an invalid talent...
					if (rawTalent.candidates[0].isHideTalent) {
						continue
					}

					talents.push({
						name: rawTalent.candidates[0].name,
						candidates: rawTalent.candidates
					})
				}
			}
		}

		const parsedChar: ParsedCharacter = {
			charId: charId,
			rarity: rawChar.rarity,

			name: rawChar.name || "",
			appellation: rawChar.appellation || "",

			code: rawChar.displayNumber || "",
			description: rawChar.itemUsage || "",
			flavorText: rawChar.itemDesc || "",

			profession: rawChar.profession,
			subProfession: rawChar.subProfessionId,

			skills: skills,
			traits: traits,
			talents: talents
		}

		Data[region][charId] = parsedChar
	}
}
