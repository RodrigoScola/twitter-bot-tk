import { TwitterStream } from "../../../db/twitterStream"
import { db } from "../../../db/database"
export default async function rulehandler(req, res) {
	const accounts = await db.getAccounts()
	const tsream = new TwitterStream(accounts)

	await tsream.start()
	res.json(tsream)
}
