import { Data, AvailableIcons } from "$lib/logic/depot"

export function load({ params }) {
	return {
		itemTable: Data[params.region],
		availableIcons: AvailableIcons,
	}
}
