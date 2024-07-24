import * as fs from "node:fs/promises"

import { ASSETS_BRANCH, ASSETS_REPO, GAMEDATA_PATH } from "$lib/constants"

import type { RegionalStrings, GHTrees } from "$lib/types"
import { error } from "@sveltejs/kit"

type EnemiesTable = {
	[enemyId: string]: {
		enemyId: string
		name: RegionalStrings
		description: RegionalStrings
		enemyTypes: string[]

		appearsInHandbook: boolean
		code: string
		sortId: number
		abilities: {
			text: RegionalStrings
			textFormat: string
		}[]
	}
}

type EnemyType = {
	id: string
	raceName: RegionalStrings
	sortId: number
}

type EnemiesResponse = {
	enemies: EnemiesTable
	enemyTypes: EnemyType[]
	availableIcons: string[]
}

const contents = await fs.readFile(`${GAMEDATA_PATH}/enemy_table.json`)
const table = JSON.parse(contents.toString()) as EnemiesTable

// fetch all the files from GitHub to determine which item has an icon and which
// doesn't, so we can display it accordingly in the HTML
const ghTrees = (await (
	await fetch(`https://api.github.com/repos/${ASSETS_REPO}/git/trees/${ASSETS_BRANCH}`)
).json()) as GHTrees

const enemies = ghTrees.tree.find((predicate) => predicate.path === "enemy")
if (!enemies) {
	error(500, "no 'enemy' tree found")
}

const enemiesTree = (await (await fetch(enemies.url)).json()) as GHTrees

// construct response
const response = {} as EnemiesResponse

response.enemies = table
response.availableIcons = Object.values(table)
	.filter((item) => {
		return enemiesTree.tree.find((predicate) => predicate.path === `${item.enemyId}.png`)
	})
	.map((thing) => thing.enemyId)

const contents2 = await fs.readFile(`${GAMEDATA_PATH}/enemy_types_table.json`)
response.enemyTypes = JSON.parse(contents2.toString())

export const EnemyData = response
