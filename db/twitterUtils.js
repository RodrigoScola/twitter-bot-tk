import _ from "lodash"
import { Account } from "./Account"
import { db } from "./database"
import { tfront } from "./TwitterApiFrontend"
export const updateaccountInformation = async (account) => {
	const updatedInformation = await tfront.getUserInfo(account.id)
	const updatedb = await db.updateAccount(account.id, {
		last_tweet: updatedInformation?.lastTweet?.id,
	})
	return updatedb
}
export const updateAccountsInformation = async (accounts = []) => {
	const promises = accounts.map(async (account) => {
		const nac = await updateaccountInformation(account)
		return new Account(nac?.id, nac)
	})
	const nwaccounts = await Promise.all(promises)
	return nwaccounts
}
export const getUsersIds = async () => {
	const ids = await db.getAccounts({
		returns: "id",
	})
	return ids
}