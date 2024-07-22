import { ParseLocalization } from "$lib/logic/localization"

const Localizations = await ParseLocalization()

export function load({ params }) {
	// biome-ignore lint/style/noNonNullAssertion: infallible
	const localizationTable = Localizations.get(params.lang) || Localizations.get("en")!

	return {
		strings: localizationTable,
		lang: params.lang,
	}
}
