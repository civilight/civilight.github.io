import type { EntryGenerator, PageServerLoad } from "./$types"

import { z } from "zod/v4"

function baseResponseSchema<T extends z.core.$ZodType>(schema: T) {
	return z.strictObject({
		code: z.uint32(),
		msg: z.string(),
		data: schema
	})
}

const ListAlbumsResponse = baseResponseSchema(
	z.array(
		z.object({
			cid: z.string()
		})
	)
)

const AlbumDetailResponse = baseResponseSchema(
	z.object({
		cid: z.string(),
		name: z.string(),
		intro: z.string(),
		coverUrl: z.url(),
		coverDeUrl: z.url(),
		songs: z.array(
			z.object({
				cid: z.string(),
				name: z.string(),
				artistes: z.array(z.string())
			})
		)
	})
)

const SongDetailResponse = baseResponseSchema(
	z.object({
		cid: z.string(),
		name: z.string(),
		sourceUrl: z.url(),
		lyricUrl: z.url().nullish(),
		mvUrl: z.url().nullish(),
		mvCoverUrl: z.url().nullish()
	})
)

type Song = {
	name: string
	sourceUrl: string
	lyricUrl: string | undefined | null
	artists: string[]
}

type Output = {
	name: string
	intro: string
	songs: Song[]
}

const BASE_ENDPOINT = "https://monster-siren.hypergryph.com/api"

export const load: PageServerLoad = async ({ params }) => {
	console.info(`Building album ${params.albumId}`)

	const resp = AlbumDetailResponse.parse(
		await (await fetch(`${BASE_ENDPOINT}/album/${params.albumId}/detail`)).json()
	)

	const output: Output = { name: resp.data.name, intro: resp.data.intro, songs: [] }

	for (const rawSong of resp.data.songs) {
		console.info(`Fetching song ${rawSong.name} ${rawSong.cid}`)

		const songDetailResp = SongDetailResponse.parse(
			await (await fetch(`${BASE_ENDPOINT}/song/${rawSong.cid}`)).json()
		)

		output.songs.push({
			name: songDetailResp.data.name,
			sourceUrl: songDetailResp.data.sourceUrl,
			lyricUrl: songDetailResp.data.lyricUrl,
			artists: rawSong.artistes
		})
	}

	return output
}

export const entries: EntryGenerator = async () => {
	const resp = ListAlbumsResponse.parse(await (await fetch(`${BASE_ENDPOINT}/albums`)).json())

	return resp.data.flatMap((v) => ({
		albumId: v.cid
	}))
}
