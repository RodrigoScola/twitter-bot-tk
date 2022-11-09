import { TwitterApi } from "twitter-api-v2"
import { deepSearch } from "../utils"
import { db } from "./database"
export const Client = new TwitterApi({
	clientId: "ZXdCU1JBN1FDNXc2NURnUm1aNTU6MTpjaQ",
	clientSecret: "pvUnAA0u8sPFKggq_U9RwFFyoRaMtu8c94TmO4r7XsSyAAyJgB",
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
	async follow(userId) {}

	async reply(text, replyUserId) {
		try {
			const { data } = await this.client.v2.reply(text, replyUserId)
			const post = await db.getPostBy("content", text)
			await db.updateOrCreate(post.id, {
				content: text,
				meta: {
					tweet_id: data.id,
				},
			})
		} catch (err) {
			return {
				data: {},
			}
		}
	}
	async getuserTimeline(userId) {
		try {
			const { data: timeline } = await this.client.v2.userTimeline(userId)

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
				return user
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

