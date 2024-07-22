import { GetEnemiesData } from "$lib/logic/enemies"

export async function load() {
	console.log("Building enemies")

	return GetEnemiesData()
}
