import type { RegionalStrings } from "$lib/types"

import { get } from "svelte/store"
import { page } from "$app/stores"

export function GetRegionalString(strings: RegionalStrings): string {
	const pageLang = get(page).params.lang

	switch (pageLang) {
		case "en":
			return strings.GL || strings.CN
		case "jp":
			return strings.JP || strings.CN
		case "kr":
			return strings.KR || strings.CN
		default:
			return strings.CN
	}
}
