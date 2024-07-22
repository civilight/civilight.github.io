import { GetDepotData } from "$lib/logic/depot"

export async function load() {
	return GetDepotData()
}
