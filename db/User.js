import { database, db } from "./database"

export class Post {
	id
	title = ""
	content = ""
	meta = {}
	created_at = ""
	type = ""
	constructor(id) {
		this.init(id).then(() => {
			return this
		})
		return this
	}
	async init(id = null) {
		if (id == null) {
			id = this.id
		}
		const post = await db.getPost(id)
		for (const prop in post) {
			this[prop] = post[prop]
		}
	}
	get(name) {
		return deepSearch(this, name)
	}
	set(key, value) {}
}
class Account extends Post {
	id
	name
	tweets = []
	last_tweet = []
	created_at = ""
	type = "account"
	constructor(id) {
		this.id = id
	}
	async init(id = null) {
		if ((id = null)) {
			id = this.id
		}
		const { data } = await database.from("accounts").select("*").eq("id", id)
		console.log(data)
	}
	get(key) {
		return deepSearch(this, key, (key) => key)
	}
	set(key, value) {
		return (deepSearch(this, key)[key] = value)
	}

	update({ name = "", tweets = null, last_tweet = null }) {
		const params = setDefaultparams(
			{
				name,
				tweets,
				last_tweet,
			},
			{
				name: this.name,
				tweets: this.tweets,
				last_tweet: this.last_tweet,
			}
		)
		console.log(params)
		return params
	}
}
