export const groupByKey = (obj = [], key = "replies") => {
	return obj.reduce((curr, next) => {
		if (!curr[next[key]]) {
			curr[next[key]] = [next]
		} else {
			curr[next[key]].push(next)
		}
		return curr
	}, {})
}

export function deepSearch(object, key, predicate) {
	if (object.hasOwnProperty(key) && predicate(key, object[key]) === true) return object

	for (let i = 0; i < Object.keys(object).length; i++) {
		let value = object[Object.keys(object)[i]]
		if (typeof value === "object" && value != null) {
			let o = deepSearch(object[Object.keys(object)[i]], key, predicate)
			if (o != null) return o
		}
	}
	return null
}
