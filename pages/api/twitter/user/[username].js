import { tclient } from "../../../../db/TwitterApi"

export default async function handler(req, res) {
	const { username } = req.query
	await tclient.init()
	if (username == null) {
		res.json({
			err: "not found",
		})
	}
	try {
		const user = await tclient.getUser(username)
		const tweets = await tclient.getLastTweetFromUser(user.id)
		res.json([
			{
				...user,
				lastTweet: tweets,
			},
		])
	} catch (err) {
		res.json([{}])
	}
}
