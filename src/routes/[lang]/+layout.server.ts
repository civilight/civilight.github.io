import { LocalizationTable } from "$lib/logic/localization"
import { GetRegionalString } from "$lib/utils"

import { RichtextData } from "$lib/server/richtext"
import type { LocalizedRichtextData } from "$lib/server/richtext"

export function load({ params }) {
	// biome-ignore lint/style/noNonNullAssertion: infallible
	const localizationTable = LocalizationTable.get(params.lang) || LocalizationTable.get("en")!
	const richtextTable = {
		richTextStyles: RichtextData.richTextStyles,
		termDescriptionDict: {},
	} as LocalizedRichtextData

	for (const v of Object.values(RichtextData.termDescriptionDict)) {
		richtextTable.termDescriptionDict[v.termId] = {
			termId: v.termId,
			termName: GetRegionalString(v.termName, params.lang),
			description: GetRegionalString(v.description, params.lang),
		}
	}

	return {
		strings: localizationTable,
		lang: params.lang,
		richtextTable: richtextTable,
	}
}
