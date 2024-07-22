import type { RegionalStrings } from "$lib/types"

export function GetRegionalString(strings: RegionalStrings, lang: string = "cn"): string {
	switch (lang) {
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
