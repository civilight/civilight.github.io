import { Data, AvailableIcons } from "$lib/logic/enemies"

export function load({ params }) {
	return {
		enemiesTable: Data[params.region],
		availableIcons: AvailableIcons,
	}
}
