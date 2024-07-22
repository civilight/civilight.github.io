import { ParseData } from "$lib/depot"

const ItemData = await ParseData()

export async function load() {
	console.log("Building depot")

	return ItemData
}
