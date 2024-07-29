import { Data } from "$lib/logic/operators"

export function load({ params }) {
	return {
		charData: Data[params.region][params.charId]
	}
}
