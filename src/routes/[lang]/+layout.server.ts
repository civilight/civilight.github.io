import { ParseLocalization } from "$lib/logic/localization"

const Localizations = await ParseLocalization()

export function load({ params }) {
	console.log(`[Language] Building ${params.lang}`)

	if (!Localizations.has(params.lang)) {
		console.warn(`Localization for ${params.lang} not found, falling back to English`)
	}

	// biome-ignore lint/style/noNonNullAssertion: infallible
	const localizationTable = Localizations.get(params.lang) || Localizations.get("en")!

	return {
		strings: localizationTable,
		lang: params.lang,
	}
}
