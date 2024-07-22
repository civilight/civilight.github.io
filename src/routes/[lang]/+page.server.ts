import { SERVERS } from "$lib/constants"

export function entries() {
	return SERVERS.map((v) => {
		return {
			lang: v,
		}
	})
}
