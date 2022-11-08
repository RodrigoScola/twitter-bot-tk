import PocketBase from "pocketbase"
import { deepSearch } from "../utils"
const database = new PocketBase("https://twitter-bot-tk.herokuapp.com")
class Database {
	async getPosts(items = { postType: "any" }) {
		let query = null
		if (items.postType !== "any") {
			query = {
				filter: `type = "${items.postType}"`,
			}
		}
		try {
			let results = await database.records.getList("posts", 1, 50, query)
			results.items = results.items.filter((item) => item.type !== "settings")
			return results
		} catch (err) {
			return null
		}
	}

	async getPost(postId) {
		try {
			const results = await database.records.getOne("posts", postId)

			return results
		} catch (err) {
			console.log(err)
			return null
		}
	}
	async getPostBy(key = "content", value) {
		try {
			const post = await database.records.getList("posts", 1, 50, {
				filter: `${key} = "${value}"`,
			})
			return post.items[0] ? post.items[0] : []
		} catch (err) {
			return {}
		}
	}
	async updatePost(postId, newData) {
		try {
			const hasPost = await this.getPost(postId)
			if (hasPost) {
				const data = {
					...hasPost,
					...newData,
				}
				const result = await database.records.update("posts", postId, data)

				return result
			} else {
				const res = await this.createPost("posts", newData)
				return res
			}
		} catch (err) {
			console.log(err)
			return false
		}
	}
	/**
	 *
	 *
	 * @param {*} { type = "", content = "", meta = {} }
	 * @return {*}
	 * @memberof Database
	 */
	async createPost(item) {
		if (!item.type) {
			return false
		}
		if (item.content && item.type == "hashtag") {
			item.content = "#" + item.content
		}

		try {
			const result = await database.records.create("posts", {
				...item,
			})
			return result.id
		} catch (err) {
			// console.log(err)
			return null
		}
	}
	async deletePost(postId) {
		const hasPost = await this.getPost(postId)

		if (!hasPost) {
			const res = await database.records.delete("posts", postId)
			return true
		}
		return false
	}
}

export const db = new Database()
