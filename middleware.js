import { NextResponse } from "next/server"
export function middleware(req) {
	// req.body = "user is username"
	const COOKIE_NAME = "ab-test"
	let bucket = req.cookies.get(COOKIE_NAME)
	if (!bucket) {
		bucket = Math.random() < 0.5 ? "new" : "old"
	}
	const path = bucket == "new" ? "new" : "old"
	const res = NextResponse.rewrite(new URL(path, req.url))

	if (req.cookies.get(COOKIE_NAME)) {
		res.cookies.set(COOKIE_NAME, bucket)
	}
}
export const config = {
	matcher: ["/api/twitter/user/snuffy"],
}
