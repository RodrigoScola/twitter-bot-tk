// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "../../db/database"
import { Client, TClient, twitterOauthKeyID } from "../../db/TwitterApi"
export default async function handler(req, res) {
	const tclient = new TClient()
	const data = await tclient.tweet((Math.random() * 1000000).toString())
	res.send(data)
}
