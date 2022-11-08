import { TwitterApi } from "twitter-api-v2"
import { db } from "./database"
export const Client = new TwitterApi({
	clientId: "ZXdCU1JBN1FDNXc2NURnUm1aNTU6MTpjaQ",
	clientSecret: "pvUnAA0u8sPFKggq_U9RwFFyoRaMtu8c94TmO4r7XsSyAAyJgB",
})
export const twitterCallbackUrl = "http://127.0.0.1:3000/api/twittercallback"
export const twitterOauthKeyID = "k9dxc71rc6tlcpb"

export class TClient {
	client = Client

	async init() {
		this.client = await this.#_setClient()
		return this.client
	}
	async #_setClient() {
		const post = await db.getPost(twitterOauthKeyID)
		const { refreshToken } = post.meta
		const {
			client: refreshClient,
			accessToken,
			refreshToken: newRefreshedToken,
		} = await Client.refreshOAuth2Token(refreshToken)
		await db.updatePost(twitterOauthKeyID, {
			meta: {
				accessToken,
				refreshToken: newRefreshedToken,
			},
		})
		this.client = refreshClient
		return this.client
	}
	async reply(text, replyUserId) {

	}
	async tweet(content) {
		if (this.client == null) {
			await this.#_setClient()
		}
		try {
			const hasPost = await db.getPostBy("content", content)
			console.log(hasPost)
			const { data } = await this.client.v2.tweet(content)
			if (hasPost.id) {
				console.log(hasPost.id)
				await db.updatePost(hasPost.id, {
					tweet_id: data.id,
				})
			} else {
				await db.createPost({
					type: "tweet",
					content,
					tweet_id: data.id,
				})
			}
			return data
		} catch (err) {
			console.log(err)
			return false
		}
	}
}
class TUser {
	username = '';
	userId = '';

	init() {

	}
	constructor(usernameorId) {
		 db.getPostBy('content', usernameorId);

	}
	

	
}



export const tclient = new TClient()