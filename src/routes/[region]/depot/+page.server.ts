import { IconPaths, Data } from "$lib/logic/depot"

export function load({ params }) {
	return {
		itemTable: Data[params.region],
		iconPaths: IconPaths,
	}
}
