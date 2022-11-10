import { db } from "../../../db/database"
import { tclient } from "../../../db/TwitterApi"
export default async function handler(req, res) {
	const { action } = req.query
	switch (action) {
		case "tweet":
			return tweethandler(req, res)
		case "reply":
			return replyhandler(req, res)
		case "stream":
			return streamhandler(req, res)
		case "randomreply":
			return randomreplyhandler(req, res)
	}
}
async function streamhandler(req, res) {
	await tclient.init()
	const stream = await tclient.stream()
	res.json({
		stream,
	})
}
async function randomreplyhandler(req, res) {
	const posts = await db.getRandomPost("reply")
	res.json(posts)
}
async function replyhandler(req, res) {
	await tclient.init()

	if (req.method == "POST") {
		try {
			const { userId, text } = req.body
			const data = await tclient.reply(text, userId)
			return res.send(data)
		} catch (err) {
			res.status(400).json({
				...err,
			})
		}
	}
	res.json({
		message: "this action only support Post Requests",
	})
}
async function tweethandler(req, res) {
	await tclient.init()
	if (req.method == "POST") {
		const { text } = req.body
		const data = await tclient.tweet("@somethings what youw ant")
		res.json(data)
	} else {
		res.json({
			err: "only on post request",
		})
	}
}
