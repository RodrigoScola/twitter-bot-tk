import { TwitterApi } from "twitter-api-v2"
import _ from "lodash"
import { deepSearch } from "../utils"
import { db } from "./database"
export const Client = new TwitterApi({
	clientId: "ZXdCU1JBN1FDNXc2NURnUm1aNTU6MTpjaQ",
	clientSecret: "6y2G_vk1aRTMl_dbv9yJ_LqiJLcnfIieYKY2UP44GUp_k7nzh3",
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
		if (this.currentID !== 0) return this.client
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
		this.currentID++
		return this.client
	}

	async reply(text, idToReply, userId) {
		try {
			const { data } = await this.client.v2.reply(text, idToReply)

			console.log(idToReply)
			console.log("this is the user id ", userId)
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

			await db.updateAccount(userId, {
				last_replied: data.id,
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
			const { data: timeline, tweets } = await this.client.v2.userTimeline(userId, {
				exclude: ["replies", "retweets"],
				max_results: 5,
			})
			return tweets
		} catch (err) {
			return {}
		}
	}
	async getLastTweetFromUser(userId) {
		try {
			const data = await this.getuserTimeline(userId)
			return data[0]
		} catch (err) {
			return { err }
		}
	}

	async getUser(userId) {
		try {
			if (_.isString(userId)) {
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
				return user
			} else {
				const { data: user } = await this.client.v2.user(userId, {
					"user.fields": [
						"withheld",

						"public_metrics",
						"profile_image_url",
						"verified",
						"description",
						"url",
					],
				})
				return user
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
