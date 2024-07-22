import { readdir, readFile } from "node:fs/promises"

type LocalizationTable = {
	hello: string
}

type LocalizationResponse = Map<string, LocalizationTable>

let _cached: LocalizationResponse

export async function ParseLocalization(): Promise<LocalizationResponse> {
	if (_cached !== undefined) {
		return _cached
	}

	const resp: LocalizationResponse = new Map()
	const dirContents = await readdir("src/localization")

	for (const filename of dirContents) {
		const bundleContent = await readFile(`src/localization/${filename}`)
		const table = JSON.parse(bundleContent.toString()) as LocalizationTable

		resp.set(filename.replace(".json", ""), table)
	}

	_cached = resp

	return resp
}
