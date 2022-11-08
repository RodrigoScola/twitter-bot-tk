import { FormInput } from "../components/forms/Input"
import { Avatar, Box, Button, Text, Center, Flex, Select } from "@chakra-ui/react"
import { db } from "../db/database"
import { groupByKey } from "../utils"
import { useState } from "react"
import { useForm } from "../hooks/useForm"
import { useFetch } from "../hooks/useFetch"
import { SearchComponent } from "../components/forms/Search"

export default function Home({ value }) {
	value = JSON.parse(value)
	const [items, setItems] = useState(value)
	const [{ type, content }, setValue] = useForm({
		type: "",
		content: "",
	})
	const handleSubmit = async (e) => {
		e.preventDefault()

		db.createPost({
			type,
			content,
		})
	}
	const addAccount = async (data) => {
		console.log(data)
		await db.createPost({
			type: "account",
			content: data?.username,
			meta: data,
		})
	}
	return (
		<div>
			twitter create
			<form onSubmit={handleSubmit}>
				<Flex minWidth={"max-content"}>
					<Box minW={"max-content"} pr={2}>
						<Select
							defaultValue={"tweet"}
							name="type"
							onChange={setValue}
							w={"fit-content"}
							placeholder="select a type"
						>
							{["tweet", "reply", "account", "hashtag"].map((v, i) => {
								return <option value={v}>{v}</option>
							})}
						</Select>
					</Box>
					{type == "account" ? (
						<SearchComponent addAccount={addAccount} />
					) : (
						<FormInput name="content" handleChange={setValue} />
					)}
					<Button>Add Response</Button>
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
