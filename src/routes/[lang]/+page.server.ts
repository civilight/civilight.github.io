import { SERVERS } from "$lib/constants.js"

export function entries() {
	return SERVERS.map((v) => {
		return {
			lang: v,
		}
	})
}
