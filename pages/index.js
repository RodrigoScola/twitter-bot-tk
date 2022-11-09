import { FormInput } from "../components/forms/Input"
import { Avatar, Box, Button, Text, Center, Flex, Select } from "@chakra-ui/react"
import { db } from "../db/database"
import { Alert } from "../components/forms/Alert"
import { groupByKey } from "../utils"
import { useState } from "react"
import { useForm } from "../hooks/useForm"
import { DeleteIcon } from "@chakra-ui/icons"
import { SearchComponent } from "../components/forms/Search"
import { tfront } from "../db/TwitterApiFrontend"

export default function Home({ value }) {
	const [items, setItems] = useState(value)
	const [{ type, content, tweetcontent }, setValue] = useForm({
		type: "reply",
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
							<h3>{key}</h3>
							<ul>
								{items[key].map((item, ind) => {
									if (key == "account") {
										return (
											<li key={ind}>
												<Flex justifyContent={"space-between"}>
													<Flex>
														<Avatar src={item?.meta?.profile_image_url} />
														<Text pl={2}>{item.content}</Text>
													</Flex>
													<Flex>
														<Alert
															submitFunction={async () => {
																await db.deletePost(item.id)
																window.location.href = "/"
															}}
															Openelement={
																<Button colorScheme={"red"}>
																	Delete
																</Button>
															}
															title="are you sure you want to delete this account?"
															content="This action is irreversible and cannot be changed"
														/>
														<Alert
															submitFunction={() => {
																tfront.tweet(tweetcontent)
															}}
															Openelement={
																<Button colorScheme={"twitter"}>
																	Tweet
																</Button>
															}
															title={`Tweet at ` + item.content}
															content={
																<>
																	<form>
																		<FormInput
																			defaultValue={`@${item.content} `}
																			name="tweetcontent"
																			isTextArea={"true"}
																			handleChange={setValue}
																		/>
																	</form>
																</>
															}
														/>
													</Flex>
												</Flex>
											</li>
										)
									}
									return (
										<li key={ind}>
											<p>{item.content}</p>
										</li>
									)
								})}
							</ul>
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
	return {
		props: {
			value: grouped,
		},
	}
}
