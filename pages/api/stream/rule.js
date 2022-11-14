import { TwitterStream } from "../../../db/twitterStream"
import { db } from "../../../db/database"
import { CronJob } from "cron"
export default async function rulehandler(req, res) {
	const accounts = await db.getAccounts()
	const tsream = new TwitterStream(accounts)

	const job = new CronJob("* * * * *", async () => {
		await tsream.start()
		console.log("done---")
	})

	job.start()

	res.json({
		message: "bot has started",
	})
}
