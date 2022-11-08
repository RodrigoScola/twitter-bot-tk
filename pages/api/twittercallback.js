// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "../../db/database"
import { Client, twitterCallbackUrl, twitterOauthKeyID } from "../../db/TwitterApi"

export default async function handler(req, res) {
	const { state, code } = req.query
	const keys = await db.getPost(twitterOauthKeyID)
	const { codeVerifier, state: storedState } = keys.meta
	if (state !== storedState) {
		return res.status(400).send({
			state: state,
			storedState,
		})
	}
	const {
		client: loggedInClient,
		accessToken,
		refreshToken,
	} = await Client.loginWithOAuth2({
		code,
		codeVerifier,
		redirectUri: twitterCallbackUrl,
	})
	await db.updatePost(twitterOauthKeyID, {
		meta: {
			codeVerifier,
			state: storedState,
			accessToken,
			refreshToken,
		},
	})

	res.send("cool")
}
