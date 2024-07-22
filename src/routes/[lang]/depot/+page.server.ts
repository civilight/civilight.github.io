import { GetDepotData } from "$lib/logic/depot"

export async function load() {
	console.log("Building depot")

	return GetDepotData()
}
