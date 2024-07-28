import { dev } from "$app/environment"

export function fetchWithAuth(endpoint: string): Promise<Response> {
	const header: HeadersInit = {}
	if (dev && process.env.TOKEN) {
		header.Authorization = process.env.TOKEN
	}

	return fetch(endpoint, { headers: header })
}
