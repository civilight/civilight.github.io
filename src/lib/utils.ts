import type { RegionalStrings } from "$lib/types"

export function GetRegionalString(strings: RegionalStrings) {
	return strings.GL || strings.CN
}
