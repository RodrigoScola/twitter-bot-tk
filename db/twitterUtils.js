import _ from "lodash"
import { Account } from "./Account"
import { db } from "./database"
import { tfront } from "./TwitterApiFrontend"
export const updateaccountInformation = async (accountId) => {
	const updatedInformation = await tfront.getUserInfo(accountId)

	const currAccount = await db.getAccountBy("twitter_id", accountId)
	const updatedb = await db.updateAccount(currAccount.id, {
		last_tweet: updatedInformation?.lastTweet?.id,
	})
	return updatedb
}
export const updateAccountsInformation = async (accounts = []) => {
	const promises = accounts.map(async (accountId) => {
		const nac = await updateaccountInformation(accountId)
		return new Account(nac?.id, { ...nac })
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