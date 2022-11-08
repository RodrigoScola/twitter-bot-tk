// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { db } from "../../db/database"
import { Client, twitterCallbackUrl, twitterOauthKeyID } from "../../db/TwitterApi"

export default async function handler(req, res) {
	const { url, codeVerifier, state } = Client.generateOAuth2AuthLink(twitterCallbackUrl, {
		scope: ["tweet.read", "tweet.write", "users.read", "offline.access"],
	})

	const d = await db.updatePost(twitterOauthKeyID, {
		meta: {
			codeVerifier: codeVerifier,
			state: state,
		},
	})
	// res.send(d)
	res.redirect(url)
}
