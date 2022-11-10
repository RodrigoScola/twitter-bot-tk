const Twit = require("twit")
const T = new Twit({
	consumer_key: "ZXdCU1JBN1FDNXc2NURnUm1aNTU6MTpjaQ",
	consumer_secret: "3XlnozYYuYa9_lPk5570Gh8ofiRfM0EW2AgEMcGeWHF2rO2e9p",
	access_token: "Mk9IN1htQ2ZhZDFIQ29CMmlpYVVnTlktRHA1Ump4QmRmZk95NmZsc0FaSGNHOjE2NjgxMTU1NDgzMjU6MToxOmF0OjE",
	access_token_secret: "LTCuKxr9zJIHeVt2YCVwZyjjFaA8KUU1KT0aSneqT8MLr",
})
export default async function rulehandler(req, res) {
	const tweets = await T.get(
		"search/tweets",
		{
			q: "petrobras",
		},
		(err, data) => {
			console.log(data)
			return data
		}
	)
	res.json(tweets)
}
