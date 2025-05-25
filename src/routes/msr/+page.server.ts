import type { PageServerLoad } from "./$types"

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
			cid: z.string(),
			name: z.string(),
			coverUrl: z.url(),
			artistes: z.array(z.string())
		})
	)
)

const BASE_ENDPOINT = "https://monster-siren.hypergryph.com/api"

export const load: PageServerLoad = async ({ params }) => {
	console.info("Building MSR frontpage")

	const resp = ListAlbumsResponse.parse(await (await fetch(`${BASE_ENDPOINT}/albums`)).json())

	return resp
}
