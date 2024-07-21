import { ParseData } from "$lib/depot.js"

const ItemData = await ParseData()

export async function entries() {
	return Object.keys(ItemData.itemTable).map((id) => {
		return {
			itemId: id,
		}
	})
}

export async function load({ params }) {
	console.log(`[Depot] Building ${params.itemId}`)

	const item = ItemData.itemTable[params.itemId]

	return {
		itemData: item,
		hasIcon: ItemData.availableIcons.includes(item.iconId),
	}
}
