import Twit from "twit"
import { Account } from "./Account"
import { db } from "./database"
import { tclient } from "./TwitterApi"
import { tfront } from "./TwitterApiFrontend"
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
			console.log(acc.id)
			if (acc.id) {
				this.accounts.push(acc)
			}
		})
	}
	async syncInformation() {
		this.accounts = await updateAccountsInformation(this.accounts)
	}
	async loop() {
		const promises = this.accounts.map(async (account) => {
			if (account.isReplied == false) {
				const rpost = await db.getRandomPost("tweet")
				// const replied = await tclient.reply(rpost, account.last_tweet, account.id)
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
		return this.accounts
	}
}
export const twitterStream = new TwitterStream()
