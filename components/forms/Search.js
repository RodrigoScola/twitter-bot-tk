import { Avatar, Box, Flex, Heading, Text, useTimeout } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"

import { FormInput } from "./Input"

export const SearchComponent = ({ handleChange, selectResult, currentTerm = "" }) => {
	const [state, setState] = useState({
		data: [],
	})

	useEffect(() => {
		const delaydebounce = setTimeout(() => {
			const go = async () => {
				if (currentTerm) {
					try {
						const data = await fetch("/api/twitter/user/" + currentTerm)
						const jsondata = await data.json()
						console.log(jsondata)
						setState({
							data: jsondata,
						})
					} catch (err) {
						setState({
							data: null,
						})
					}
				}
			}
			go()
		}, 1400)

		return () => clearTimeout(delaydebounce)
	}, [currentTerm])

	useEffect(() => {
		console.log("result")
		console.log(state)
		if (state.data[0] !== null) {
			selectResult(state?.data[0])
		}
	}, [state])

	const selectSearchResult = (data) => {
		selectResult(data)
	}
	console.log(state.data)
	return (
		<Flex minW={"80%"}>
			<FormInput value={currentTerm} name={"content"} handleChange={handleChange} />
			<Box>
				{/* descritpion
					id
					name
					profile_image_url
					pulblic_metrics 
						followers_count
						following_count
					username
					verified
				
				 */}
				{state?.data?.map((v, i) => {
					return (
						<Flex key={"search_result_" + i} alignItems={"center"}>
							<Avatar m={3} name={v.name} src={v?.profile_image_url} />
							<Flex dir="column">
								<Text pr={3}>{v?.username}</Text>
								<Text>followers: {v?.public_metrics?.followers_count}</Text>
							</Flex>
						</Flex>
					)
				})}
			</Box>
		</Flex>
	)
}
