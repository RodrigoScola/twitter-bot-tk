import { FormInput } from "../components/forms/Input"
import { Box, Button, Flex, Select, Accordion, ListItem, UnorderedList, AccordionItem } from "@chakra-ui/react"

import { db } from "../db/database"
import { Alert } from "../components/forms/Alert"
import { groupByKey } from "../utils"
import { useEffect, useState } from "react"
import { useForm } from "../hooks/useForm"
import { DeleteIcon } from "@chakra-ui/icons"
import { SearchComponent } from "../components/forms/Search"
import { AccountComponent } from "../components/forms/Account"
import lodash from "lodash"
export default function Home({ value }) {
	const [items, setItems] = useState({
		account: [],
		tweet: [],
	})
	const [{ type, content, tweetcontent }, setValue] = useForm({
		type: "account",
		content: "",
		tweetcontent: "",
	})
	const [meta, setMeta] = useState({})
	useEffect(() => {
		if (value) {
			setItems(value)
		}
	}, [value])
	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!content || !type) return false
		let postObj = {
			type,
			content,
			meta,
		}
		if (type == "account") {
			await db.createAccount(meta.id, {
				last_tweet: meta.lastTweet.id,
				name: postObj.content,
			})
		}

		await db.createPost(postObj)

		window.location.href = "/"
	}

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<Flex minWidth={"max-content"}>
					<Box minW={"max-content"} pr={2}>
						<Select
							defaultValue={type}
							name="type"
							onChange={setValue}
							w={"fit-content"}
							placeholder="select a type"
						>
							{["tweet", "reply", "account", "hashtag"].map((v, i) => {
								return (
									<option key={"option" + i} value={v}>
										{v}
									</option>
								)
							})}
						</Select>
					</Box>
					{type == "account" ? (
						<SearchComponent currentTerm={content} selectResult={setMeta} handleChange={setValue} />
					) : (
						<FormInput name="content" handleChange={setValue} />
					)}
					<Button minW={"max-content"} type="submit">
						Add {type}
					</Button>
				</Flex>
			</form>
			<ul>
				{Object.keys(items).map((key, i) => {
					return (
						<li key={key + i}>
							<h3 className={`item_title`}>{lodash.capitalize(key)}</h3>
							{key == "account" ? (
								<Accordion>
									{items[key].map((item, ind) => {
										return (
											<AccordionItem pt={6} key={ind}>
												<AccountComponent
													item={item}
													tweetcontent={tweetcontent}
													setValue={setValue}
												/>
											</AccordionItem>
										)
									})}
								</Accordion>
							) : (
								<UnorderedList>
									{items[key].map((item, ind) => {
										return (
											<li key={ind}>
												<p>{item.content}</p>
											</li>
										)
									})}
								</UnorderedList>
							)}
						</li>
					)
				})}
			</ul>
		</div>
	)
}
export async function getServerSideProps() {
	const data = await db.getPosts()

	const grouped = groupByKey(data, "type")
	// const u = await updateAccountsInformation(grouped?.account)

	return {
		props: {
			value: grouped,
		},
	}
}
