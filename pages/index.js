import { FormInput } from "../components/forms/Input"
import { Avatar, Box, Button, Text, Center, Flex, Select, Accordion, ListItem, UnorderedList } from "@chakra-ui/react"
import { db } from "../db/database"
import { Alert } from "../components/forms/Alert"
import { groupByKey } from "../utils"
import { useState } from "react"
import { useForm } from "../hooks/useForm"
import { DeleteIcon } from "@chakra-ui/icons"
import { SearchComponent } from "../components/forms/Search"
import { tfront } from "../db/TwitterApiFrontend"
import { AccountComponent } from "../components/forms/Account"
import lodash from "lodash"
import { updateAccountsInformation, updateaccountInformation } from "../db/twitterUtils"
export default function Home({ value }) {
	const [items, setItems] = useState(value)
	const [{ type, content, tweetcontent }, setValue] = useForm({
		type: "tweet",
		content: "",
		tweetcontent: "",
	})
	const [meta, setMeta] = useState({})

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!content) return false
		let postObj = {
			type,
			content,
			meta,
		}
		if (type == "account") {
			postObj.id = meta.id
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
							<h3>{lodash.capitalize(key)}</h3>

							<UnorderedList>
								{items[key].map((item, ind) => {
									if (key == "account") {
										return (
											<ListItem pt={6} key={ind}>
												<AccountComponent
													item={item}
													tweetcontent={tweetcontent}
													setValue={setValue}
												/>
											</ListItem>
										)
									}
									return (
										<li key={ind}>
											<p>{item.content}</p>
										</li>
									)
								})}
							</UnorderedList>
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
