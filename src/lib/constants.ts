import { dev } from "$app/environment"

// gamedata path relative to the root of the project (aka. parent of src)
export const GAMEDATA_PATH = "gamedata"

export const ASSETS_REPO = "ArknightsAssets/ArknightsAssets"
export const ASSETS_BRANCH = "cn"
export const ASSETS_PATH = "assets/torappu/dynamicassets"
export const ASSETS_BASE = `https://raw.githubusercontent.com/${ASSETS_REPO}/${ASSETS_BRANCH}/${ASSETS_PATH}`

// We don't link directly to GitHub because GitHub doesn't have cache controls like
// an actual CDN, so we proxy GitHub images through a CDN instead
// If you want to disable proxying, just leave this blank
export const IMAGE_CDN = dev ? "" : "https://wsrv.nl/?url="

export const SERVERS = ["en", "cn", "jp", "kr"]
export const SERVER_TO_LANGCODE_MAP: { [region: string]: string } = {
	en: "en_US",
	cn: "zh_CN",
	jp: "ja_JP",
	kr: "ko_KR",
}
