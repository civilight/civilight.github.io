import type { RegionalStrings } from "$lib/types"
import { GAMEDATA_PATH } from "$lib/constants"

import { readFile } from "node:fs/promises"

type Term = {
	description: RegionalStrings
	termName: RegionalStrings
	termId: string
}

type TermDescriptionDict = {
	[termId: string]: Term
}

type RichtextStyles = {
	[key: string]: string
}

export type RichtextData = {
	richTextStyles: RichtextStyles
	termDescriptionDict: TermDescriptionDict
}

type LocalizedTerm = {
	description: string
	termName: string
	termId: string
}

type LocalizedTermDescriptionDict = {
	[termId: string]: LocalizedTerm
}

type LocalizedRichtextStyles = {
	[key: string]: string
}

export type LocalizedRichtextData = {
	richTextStyles: LocalizedRichtextStyles
	termDescriptionDict: LocalizedTermDescriptionDict
}

export const RichtextData = JSON.parse(
	(await readFile(`${GAMEDATA_PATH}/richtext_table.json`)).toString(),
) as RichtextData
