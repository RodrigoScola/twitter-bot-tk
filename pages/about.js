import { useFetch } from "../hooks/useFetch"

export default function About() {
	const data = useFetch("/api/twitter/snuffy")
	console.log(data)

	return <div></div>
}
