import { useEffect, useState } from "react"
import { useObj } from "./useObj"

export const useFetch = (url) => {
	const [state, setState] = useState({
		data: null,
		loading: true,
	})
	useEffect(() => {
		setState((state) => ({ data: state.data, loading: true }))
		fetch(url)
			.then((res) => res.json())
			.then((y) => setState((state) => ({ data: y, loading: false })))
	}, [url])
	return state
}
