import { useState } from "react"

export const useObj = (initialState) => {
	const [data, setData] = useState(initialState)

	const setNewData = (newData) => {
		setData((curr) => ({
			...newData,
			...data,
		}))
	}
	return [data, setNewData]
}
