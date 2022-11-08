import { Avatar, Box, Heading, Text, useTimeout } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"

import { FormInput } from "./Input"

export const SearchComponent = ({ addAccount }) => {
	const [searchTerm, setSearchTerm] = useState("snuffy")
	const [state, setState] = useState({
		data: null,
	})

	useEffect(() => {
		const delaydebounce = setTimeout(() => {
			const go = async () => {
				if (searchTerm) {
					try {
						const data = await fetch("/api/twitter/" + searchTerm)
						const jsondata = await data.json()
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
	}, [searchTerm])
	const selectSearchResult = (e) => {
		console.log(e)
		if (addAccount) {
			addAccount(state.data)
		}
	}
	return (
		<div>
			<FormInput
				value={searchTerm}
				name={"searchTerm"}
				handleChange={(e) => {
					console.log(e.target.value)
					setSearchTerm(e.target.value)
				}}
			/>
			<Box>
				<ul>
					{state?.data !== null ? (
						<li onClick={() => selectSearchResult(state.data)} key={"asdf"}>
							<Box>
								<Avatar src={state?.data?.profile_image_url} />
								<Heading>{state?.data?.name}</Heading>
								<Text>followers: {state?.data?.public_metrics?.followers_count}</Text>
							</Box>
						</li>
					) : (
						<Text>No User found</Text>
					)}
				</ul>
			</Box>
		</div>
	)
}
