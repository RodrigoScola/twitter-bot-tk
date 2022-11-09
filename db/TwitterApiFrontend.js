export const fetchData = async (url, props) => {
	const data = await fetch(url, {
		method: props.method ? props.method : "GET",
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
	#baseUrl = "/api/twitter/"

	async tweet(text) {
		const data = await fetchData(this.#baseUrl + "tweet", {
			method: "POST",
			body: {
				text,
			},
		})

		return data
	}
}
export const tfront = new TwitterApiFrontend()
