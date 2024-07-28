import * as fs from "node:fs/promises"

import {
	GAMEDATA_PATH,
	ASSETS_REPO,
	ASSETS_BRANCH,
	SERVER_TO_LANGCODE_MAP,
	SERVERS,
} from "$lib/constants"

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
}

type RawCharacterTable = { [id: string]: RawCharacter }

type ParsedCharacter = {
	charId: string
	rarity: string

	name: string
	trait: string
	appellation: string

	code: string
	description: string
	flavorText: string

	profession: string
	subProfession: string
}

type CharacterTable = { [id: string]: ParsedCharacter }

export const Data: { [region: string]: CharacterTable } = {}

for (const region of SERVERS) {
	const langCode = SERVER_TO_LANGCODE_MAP[region]
	Data[region] = {}

	const rawCharTable = JSON.parse(
		(
			await fs.readFile(`${GAMEDATA_PATH}/${langCode}/gamedata/excel/character_table.json`)
		).toString(),
	) as RawCharacterTable

	for (const [charId, rawChar] of Object.entries(rawCharTable)) {
		if (rawChar.subProfessionId.includes("notchar") || rawChar.profession === "TOKEN") continue
		if (charId === "char_512_aprot") continue // why is there a duplicate Shalem

		const parsedChar: ParsedCharacter = {
			charId: charId,
			rarity: rawChar.rarity,

			name: rawChar.name || "",
			trait: rawChar.description || "",
			appellation: rawChar.appellation || "",

			code: rawChar.displayNumber || "",
			description: rawChar.itemUsage || "",
			flavorText: rawChar.itemDesc || "",

			profession: rawChar.profession,
			subProfession: rawChar.subProfessionId,
		}

		Data[region][charId] = parsedChar
	}
}
