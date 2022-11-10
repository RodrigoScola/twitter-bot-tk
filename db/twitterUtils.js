import _ from "lodash"
import { db } from "./database"
import { tfront } from "./TwitterApiFrontend"
export const updateaccountInformation = async (account) => {
	try {
		const user = await tfront.getUserInfo(account.id)
		const currUser = await db.updateAccount(user.id, {
			last_tweet: user.lastTweet,
		})

		return currUser
	} catch (err) {}
}
export const updateAccountsInformation = async (accounts = []) => {
	accounts.forEach(async (account) => {
		const currentAccount = await updateaccountInformation(account)
	})
}
