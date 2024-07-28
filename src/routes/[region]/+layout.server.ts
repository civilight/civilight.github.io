import { GAMEDATA_PATH, SERVER_TO_LANGCODE_MAP, SERVERS } from "$lib/constants"
import * as fs from "node:fs/promises"

import type { RichtextTable, LocalizationTable } from "$lib/types"

// read localization files
const Localizations: { [region: string]: LocalizationTable } = {}
const dirContents = await fs.readdir("src/localization")

for (const filename of dirContents) {
	const bundleContent = await fs.readFile(`src/localization/${filename}`)
	const table = JSON.parse(bundleContent.toString()) as LocalizationTable

	Localizations[filename.replace(".json", "")] = table
}

// read richtext data
type RawGamedataConst = RichtextTable

const GamedataConst: { [region: string]: RawGamedataConst } = {}

for (const region of SERVERS) {
	const rawTable = JSON.parse(
		(
			await fs.readFile(
				`${GAMEDATA_PATH}/${SERVER_TO_LANGCODE_MAP[region]}/gamedata/excel/gamedata_const.json`,
			)
		).toString(),
	) as RawGamedataConst

	GamedataConst[region] = {
		richTextStyles: rawTable.richTextStyles,
		termDescriptionDict: rawTable.termDescriptionDict,
	}
}

export function load({ params }) {
	const localizationTable = Localizations[params.region] || Localizations.en

	return {
		richtextTable: GamedataConst[params.region],
		strings: localizationTable,
		region: params.region,
	}
}
