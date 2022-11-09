// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { tclient } from "../../../db/TwitterApi"
export default async function tweethandler(req, res) {
	await tclient.init()
	if (req.method == "POST") {
		const { text } = req.body
		console.log(text)
		const data = await tclient.tweet("@somethings what youw ant")
		console.log(data)
		res.json(data)
	} else {
		res.json({
			err: "only on post request",
		})
	}
}
