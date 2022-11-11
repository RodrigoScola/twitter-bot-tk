import { deepSearch } from "../utils"

export class Account {
	id = ""
	name = ""
	last_replied = ""
	last_tweet = ""
	tweets = []
	constructor(id, props = { name: "", last_replied: "", last_tweet: "", tweets: [] }) {
		this.id = id
		this.name = props.name
		this.last_replied = props.last_replied
		this.last_tweet = props.last_tweet
		this.tweets = props.tweets
		this.replied = this.isReplied
		return this
	}
	get isReplied() {
		if (this.last_replied == this.last_tweet) {
			return true
		}
		return false
	}
}
