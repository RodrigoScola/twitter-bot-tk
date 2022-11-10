import { site_url } from "../variables"

export const fetchData = async (url, props = { method: "GET" }) => {
	const data = await fetch(url, {
		method: props.method,
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(props.body),
	})
	const jsondata = data.json()
	return jsondata
}

class TwitterApiFrontend {
	#baseUrl = site_url + "/api/twitter/"
	async reply(text, userId) {
		await fetchData(this.#baseUrl + "reply", {
			method: "POST",
			body: {
				text,
				userId,
			},
		})
	}
	async getUserInfo(userId) {
		const data = await fetchData(this.#baseUrl + "user/" + userId)
		return data[0]
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
