import { Data, IconPaths } from "$lib/logic/enemies"

export function load({ params }) {
	return {
		enemiesTable: Data[params.region],
		iconPaths: IconPaths,
	}
}
