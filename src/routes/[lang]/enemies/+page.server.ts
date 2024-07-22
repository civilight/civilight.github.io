import { GetEnemiesData } from "$lib/logic/enemies"

export async function load() {
	return GetEnemiesData()
}
