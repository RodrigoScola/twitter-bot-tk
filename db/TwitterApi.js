import { TwitterApi } from "twitter-api-v2"
import { deepSearch } from "../utils"
import { db } from "./database"
export const Client = new TwitterApi({
	clientId: "ZXdCU1JBN1FDNXc2NURnUm1aNTU6MTpjaQ",
	clientSecret: "3XlnozYYuYa9_lPk5570Gh8ofiRfM0EW2AgEMcGeWHF2rO2e9p",
})

export const twitterCallbackUrl = "http://127.0.0.1:3000/api/twittercallback"
export const twitterOauthKeyID = "1"

export class TClient {
	client = Client
	currentID = 0
	async init() {
		this.client = await this.#_setClient()
		return this.client
	}

	async #_setClient() {
		const post = await db.getPost(1)
		// console.log(post)
		const { refreshToken } = post.meta
		const {
			client: refreshClient,
			accessToken,
			refreshToken: newRefreshedToken,
		} = await Client.refreshOAuth2Token(refreshToken)
		const currMeta = await db.getPost(twitterOauthKeyID)
		await db.updatePost(twitterOauthKeyID, {
			meta: {
				...currMeta.meta,
				accessToken,
				refreshToken: newRefreshedToken,
			},
		})
		this.client = refreshClient
		return this.client
	}

	async stream() {
		const { data } = await this.client.v2.updateStreamRules({
			add: [
				{
					value: "from:rodrio00343267 -is:retweet -is:reply ",
				},
			],
		})
		const samplestream = await this.client.v2.sampleStream()
		return data
	}
	async reply(text, idToReply) {
		try {
			const { data } = await this.client.v2.reply(text, idToReply)
			console.log(idToReply)
			const post = await db.getPostBy("title", idToReply)
			console.log(post)
			await db.updateOrCreate(post.id, {
				content: text,
				type: "reply",
				title: idToReply,
				meta: {
					replyId: idToReply,
					tweet_id: data.id,
				},
			})
			const account = await db.getAccountBy("last_tweet", idToReply)
			await db.updateAccount(account.id, {
				last_replied: true,
			})

			return {
				text: data.text,
				id: data.id,
			}
		} catch (err) {
			console.log(err)
			return {
				data: err,
			}
		}
	}
	async getuserTimeline(userId) {
		try {
			const { data: timeline } = await this.client.v2.userTimeline(userId, {
				exclude: ["replies", "retweets"],
			})

			return timeline
		} catch (err) {
			return {}
		}
	}
	async getLastTweetFromUser(userId = "1622607991") {
		try {
			const { data } = await this.getuserTimeline(userId)
			return data[0]
		} catch (err) {
			return {}
		}
	}

	async getUser(userId) {
		try {
			if (!Number(userId)) {
				const { data: user } = await this.client.v2.userByUsername(userId, {
					"user.fields": [
						"withheld",
						"public_metrics",
						"profile_image_url",
						"verified",
						"description",
						"url",
					],
				})
				return {
					id: user.id,
					...user,
				}
			} else {
				const { data: user } = await this.client.v2.user(Number(userId), {
					"user.fields": [
						"withheld",
						"public_metrics",
						"profile_image_url",
						"verified",
						"description",
						"url",
					],
				})
				return {
					id: user.id,
					...user,
				}
			}
		} catch (err) {
			console.log(err)
			return err
		}
	}
	async tweet(content, options = {}) {
		if (this.client == null) {
			await this.#_setClient()
		}
		try {
			const { data } = await this.client.v2.tweet(content)
			const hasPost = await db.getPostBy("content", content)
			await db.updateOrCreate(hasPost.id, {
				content,
				type: "tweet",
				meta: {
					tweet_id: data.id,
				},
			})
			return data
		} catch (err) {
			console.log(err)
			return err
		}
	}
}
export const tclient = new TClient()

