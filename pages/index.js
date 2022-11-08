import { FormInput } from "../components/forms/Input"
import { Avatar, Box, Button, Text, Center, Flex, Select } from "@chakra-ui/react"
import { db } from "../db/database"
import { groupByKey } from "../utils"
import { useState } from "react"
import { useForm } from "../hooks/useForm"
import { SearchComponent } from "../components/forms/Search"

export default function Home({ value }) {
	value = JSON.parse(value)
	const [items, setItems] = useState(value)
	const [{ type, content }, setValue] = useForm({
		type: "reply",
		content: "",
	})
	const [meta, setMeta] = useState({})

	const handleSubmit = async (e) => {
		e.preventDefault()
		console.log(meta)
		await db.createPost({
			type,
			content,
			meta,
		})
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
						<li key={Date.now()}>
							<h3>{key}</h3>
							<ul>
								{items[key].map((item, ind) => {
									if (key == "account") {
										console.log(item)
										return (
											<li key={ind}>
												<Flex>
													<Avatar src={item?.meta?.profile_image_url} />
													<Text pl={2}>{item.content}</Text>
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
	const grouped = JSON.stringify(groupByKey(data.items, "type"))
	return {
		props: {
			value: grouped,
		},
	}
}
