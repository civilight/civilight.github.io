import { SERVERS } from "$lib/constants"

export function entries() {
	return SERVERS.map((v) => ({ region: v }))
}
