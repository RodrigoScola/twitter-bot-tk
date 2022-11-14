import { Account } from "./Account"
import { db } from "./database"
import { formatItem, formatItems } from "../utils"
import { tclient } from "./TwitterApi"
import { tfront } from "./TwitterApiFrontend"
import _ from "lodash"
import { updateAccountsInformation } from "./twitterUtils"

class TwitterRules {
	rules = []

	constructor(userIds = []) {
		userIds.forEach((userId) => {
			this.createRule({
				userIdOrName: userId,
			})
		})
	}
	get rules() {
		return null
	}
	createRule({ userIdOrName = "" }) {
		const currentRule = {
			value: `from:${userIdOrName} -is:retweet -is:reply`,
		}
		this.rules.push({
			[Date.now()]: currentRule,
		})
		return currentRule
	}
}

export class TwitterStream {
	accounts = []
	posts = []
	constructor(accounts = []) {
		accounts.forEach((account) => {
			const acc = new Account(account.id, { ...account })
			if (acc.id) {
				this.accounts.push(acc)
			}
		})
	}
	async syncInformation() {
		const names = formatItems(this.accounts, {
			returns: "twitter_id",
		})
		this.accounts = await updateAccountsInformation(names)
	}
	async loop() {
		const promises = this.accounts.map(async (account) => {
			if (account.isReplied == false) {
				const rpost = await db.getRandomPost("tweet")
				// console.log(rpost.content)

				const replied = await tfront.reply(
					_.toString(Math.floor(Math.random() * 1000)),
					account.last_tweet,
					account.twitter_id
				)
				this.posts.push(rpost)
			}
			return account
		})
		const posts = await Promise.all(promises)
		return posts
	}
	async start() {
		await this.syncInformation()
		await this.loop()
		// return this.accounts
	}
}
export const twitterStream = new TwitterStream()
