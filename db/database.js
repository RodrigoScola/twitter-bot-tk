import { deepSearch } from "../utils"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://yxkqivhetpijdrfahibb.supabase.co"
const supaKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4a3FpdmhldHBpamRyZmFoaWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc5NDc2NDcsImV4cCI6MTk4MzUyMzY0N30.llKUEOqMqUFsFRFZ8y4f_3nZ2p8rLdpmibDeVxuhxic"
export const database = createClient(supabaseUrl, supaKey)
class Database {
	async getPosts() {
		let query = database.from("posts").select("*").neq("type", "settings")

		const { data } = await query
		return data
	}

	async getPost(postId) {
		try {
			const { data } = await database.from("posts").select("*").eq("id", postId)

			return data[0]
		} catch (err) {
			return {}
		}
	}
	async getPostBy(key = "content", value) {
		try {
			const { data } = await database.from("posts").select("*").eq("content", value)

			return data[0] !== undefined ? data[0] : {}
		} catch (err) {
			return {}
		}
	}
	async updatePost(postId, newData) {
		try {
			const { data, err } = await database.from("posts").update(newData).eq("id", postId).select()
			return { data }
		} catch (err) {
			return {}
		}
	}
	async updateOrCreate(postid, newData) {
		const hasPost = await this.getPost(postid)

		if (hasPost.id) {
			const post = await db.updatePost(hasPost.id, {
				...newData,
			})
			return post
		} else {
			const post = await db.createPost(newData)
			return post
		}
	}

	async createPost(item) {
		try {
			const { data } = await database
				.from("posts")
				.insert({ ...item })
				.select()
			return data
		} catch (err) {
			return {}
		}
	}

	async deletePost(postId) {
		const { data } = await database.from("posts").delete().eq("id", postId).select()
		return data
	}
}

export const db = new Database()
