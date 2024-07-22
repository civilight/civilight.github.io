// gamedata path relative to the root of the project (aka. parent of src)
export const GAMEDATA_PATH = "gamedata"

export const ASSETS_REPO = "fexli/ArknightsResource"
export const ASSETS_BRANCH = "main"
export const ASSETS_BASE = `https://raw.githubusercontent.com/${ASSETS_REPO}/${ASSETS_BRANCH}`

// We don't link directly to GitHub because GitHub doesn't have cache controls like
// an actual CDN, so we proxy GitHub images through a CDN instead
// If you want to disable proxying, just leave this blank
export const IMAGE_CDN = ""

export const SERVERS = ["en", "cn", "jp", "kr"]
