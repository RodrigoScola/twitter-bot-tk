import { deepSearch, formatItems, setDefaultparams } from "../utils"
import { createClient } from "@supabase/supabase-js"
import _ from "lodash"
const supabaseUrl = "https://yxkqivhetpijdrfahibb.supabase.co"
const supaKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4a3FpdmhldHBpamRyZmFoaWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc5NDc2NDcsImV4cCI6MTk4MzUyMzY0N30.llKUEOqMqUFsFRFZ8y4f_3nZ2p8rLdpmibDeVxuhxic"
export const database = createClient(supabaseUrl, supaKey)
class Database {
	#tablename = "posts"
	async getPosts(options = {}) {
		let query = database.from(this.#tablename).select("*").neq("type", "settings").neq("type", "reply")
		const { data } = await query

		return formatItems(data, options)
	}
	async getRandomPost(postType = "reply") {
		let { data: allPosts } = await database
			.from(this.#tablename)
			.select("*")
			.neq("type", "settings")
			.eq("type", postType)
		const pIndex = _.random(0, allPosts.length - 1)

		return allPosts[pIndex]
	}
	async getPost(postId) {
		try {
			const { data } = await database.from(this.#tablename).select("*").eq("id", postId)

			return data[0]
		} catch (err) {
			return {}
		}
	}
	async getPostBy(key = "content", value) {
		try {
			const { data } = await database.from(this.#tablename).select("*").eq(key, value)
			return data[0] !== undefined ? data[0] : {}
		} catch (err) {
			return {}
		}
	}
	async updatePost(postId, newData) {
		try {
			const { data, err } = await database.from(this.#tablename).update(newData).eq("id", postId).select()
			return { data }
		} catch (err) {
			return {}
		}
	}
	async updateOrCreate(postid, newData) {
		const hasPost = await this.getPost(postid)

		if (hasPost.id) {
			if (hasPost.type == "account") {
				await db.updateAccount(hasPost.id, newData)
			}
			const post = await db.updatePost(hasPost.id, newData)
			return post
		} else {
			const post = await db.createPost(newData)
			return post
		}
	}

	async createPost(item) {
		try {
			const { data } = await database
				.from(this.#tablename)
				.insert({ ...item })
				.select()

			return data
		} catch (err) {
			return {}
		}
	}
	async createAccount(accountId, item) {
		const { data } = await database
			.from("accounts")
			.insert({ twitter_id: accountId, ...item })
			.select()
		return data
	}
	async getAccountBy(key, value) {
		try {
			const { data } = await database.from("accounts").select("*").eq(key, value)
			console.log(data)
			return data[0] !== undefined ? data[0] : {}
		} catch (err) {
			return {}
		}
	}
	async postToAccount(postId) {
		console.log(postId, " this is the post id")
		const post = await this.getPost(32)
		// console.log(post, "this is the post")
		// const account = await this.getAccountBy("name", post.content)
		return account
	}
	async getAccount(accountId) {
		try {
			const { data } = await database.from("accounts").select("*").eq("id", accountId)
			return data[0]
		} catch (err) {
			return err
		}
	}
	async getAccounts(options = {}) {
		try {
			const { data } = await database.from("accounts").select("*")
			return formatItems(data, options)
		} catch (err) {
			return err
		}
	}
	async updateAccount(accountId = "", item) {
		const { data: user } = await database.from("accounts").update(item).eq("id", accountId).select()
		const post = await this.getAccount(accountId)
		return post
	}
	async deleteAcccount(accountId) {
		const { data: account } = await database.from("accounts").delete().eq("id", accountId)
		return account
	}
	async deletePost(postId) {
		const data = await this.getPost(postId)
		if (data.type == "account") {
			const account = await this.getAccountBy("name", data.content)
			console.log(account)
			await this.deleteAcccount(account.id)
		}
		await database.from(this.#tablename).delete().eq("id", postId)

		return data
	}
}

export const db = new Database()
