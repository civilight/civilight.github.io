import { ParseData } from "$lib/depot"

const ItemData = await ParseData()

export async function load() {
	return ItemData
}
