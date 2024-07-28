export type RegionalStrings = {
	CN: string
	GL?: string
	JP?: string
	KR?: string
}

export type GHTrees = {
	tree: {
		path: string
		sha: string
		url: string
	}[]
}

export type RichtextTable = {
	richTextStyles: { [key: string]: string }
	termDescriptionDict: {
		[key: string]: {
			termId: string
			termName: string
			description: string
		}
	}
}

export type LocalizationTable = {
	depot: string
	enemies: string
	glossary: string

	level: string
}
