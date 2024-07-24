import { readdir, readFile } from "node:fs/promises"

type LocalizationTable = {
	depot: string
	enemies: string
}

type LocalizationResponse = Map<string, LocalizationTable>

const resp: LocalizationResponse = new Map()
const dirContents = await readdir("src/localization")

for (const filename of dirContents) {
	const bundleContent = await readFile(`src/localization/${filename}`)
	const table = JSON.parse(bundleContent.toString()) as LocalizationTable

	resp.set(filename.replace(".json", ""), table)
}

export const LocalizationTable = resp
