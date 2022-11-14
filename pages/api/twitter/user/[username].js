import { db } from "../../../../db/database"
import { tclient } from "../../../../db/TwitterApi"

export default async function handler(req, res) {
	const { username } = req.query
	try {
		await tclient.init()
		const user = await tclient.getUser(username)
		const tweets = await tclient.getLastTweetFromUser(user.id)
		res.json([
			{
				...user,
				lastTweet: {
					id: tweets.id,
					text: tweets.text,
				},
			},
		])
	} catch (err) {
		res.json(err)
	}
}
