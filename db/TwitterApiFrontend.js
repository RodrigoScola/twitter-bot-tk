import { site_url } from "../variables"

export const fetchData = async (url, props = { method: "GET" }) => {
	try {
		const params = {
			method: props.method,
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		}
		if (props.body !== undefined && params.method !== "GET") {
			params.body = JSON.stringify(props.body)
		}
		const data = await fetch(url, params)
		const jsondata = data.json()
		return jsondata
	} catch (err) {
		return {}
	}
}

class TwitterApiFrontend {
	#baseUrl = site_url + "/api/twitter/"
	async reply(text, tweetId, userId) {
		try {
			await fetchData(this.#baseUrl + "reply", {
				method: "POST",
				body: {
					text,
					tweetId,
					userId,
				},
			})
		} catch (err) {
			console.log(err)
		}
	}
	async getUserInfo(userId) {
		try {
			const data = await fetchData("api/twitter/user/" + userId, {
				method: "GET",
			})
			return data
		} catch (err) {
			return [{}]
		}
	}
	async tweet(text) {
		const data = await fetchData(this.#baseUrl + "tweet", {
			method: "POST",
			body: {
				text,
			},
		})

		return data[0]
	}
}
export const tfront = new TwitterApiFrontend()
