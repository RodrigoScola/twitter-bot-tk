import { useFetch } from "../hooks/useFetch"
import { db } from "../db/database"

export default function About({ value }) {
	console.log(value)
	return <div></div>
}
export async function getServerSideProps() {
	const data = await db.getPosts({
		postType: "tweet",
	})
	return {
		props: {
			value: data,
		},
	}
}
