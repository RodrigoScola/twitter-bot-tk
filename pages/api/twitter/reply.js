import { tclient } from "../../../db/TwitterApi"
export default async function replyhandler(req, res) {
	await tclient.init()
	const { text, replyId } = req.body
	const data = tclient.reply(text, replyId)
	res.send(data)
}
