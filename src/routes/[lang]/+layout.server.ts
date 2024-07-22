export function load({ params }) {
	console.log(`[Language] Building ${params.lang}`)

	return {
		lang: params.lang,
	}
}
