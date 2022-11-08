// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { tclient } from "../../db/TwitterApi"
export default async function tweethandler(req, res) {
	await tclient.init()
	const data = await tclient.tweet((Math.random() * 1000000).toString())
	res.send(data)
}
