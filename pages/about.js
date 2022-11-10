import { useFetch } from "../hooks/useFetch"
import { db, Post } from "../db/database"

export default function About({ value }) {
	console.log(value)
	return <div></div>
}
export async function getServerSideProps() {
	const p = new Post(1)
	console.log(p)
	return {
		props: {
			value: JSON.stringify(p),
		},
	}
}
