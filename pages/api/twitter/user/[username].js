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
		tclient.client.v2.user
		const { data: user } = await tclient.client.v2.userByUsername(username, {
			"user.fields": ["withheld", "public_metrics", "profile_image_url", "verified", "description", "url"],
		})

		res.json([user])
	} catch (err) {
		res.json([{}])
	}
}
