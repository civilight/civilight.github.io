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

export type GHContent = {
	name: string
	path: string
	sha: string
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
	operators: string

	level: string
	level_plural: string

	description: string
	duration: string
	init_sp: string
	sp_cost: string
	blackboard: string
}

export type BlackboardEntry = {
	key: string
	value: number
	valueStr: string | undefined
}
