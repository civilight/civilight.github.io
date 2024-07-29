import { Data } from "$lib/logic/operators"

export function load({ params }) {
	return {
		charTable: Data[params.region]
	}
}
