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
export const setDefaultparams = (obj, defaults = {}, props = { isStrict: false }) => {
	if (props.isStrict == true) {
		return {
			...defaults,
			...obj,
		}
	}
	Object.keys(defaults).map((v, i) => {
		if (obj.hasOwnProperty(v)) {
			defaults[v] = obj[v]
		}
	})
	return defaults
}
export function deepSearch(object, key, predicate = null) {
	if (object.hasOwnProperty(key)) {
		if (predicate !== null && predicate(key, object) == true) {
			return object
		}
		return object
	}

	for (let i = 0; i < Object.keys(object).length; i++) {
		let value = object[Object.keys(object)[i]]
		if (typeof value === "object" && value != null) {
			let o = deepSearch(object[Object.keys(object)[i]], key, predicate)
			if (o != null) return o
		}
	}
	return null
}

const data = {
	one: "two",
	tw: {
		thre: "dos",
		four: ["as"],
	},
	thre: {
		tacors: {
			locos: "pizza",
		},
		gaming: {
			trye: "yes",
		},
	},
}

// // class Post {
// // 	data
// // 	constructor(data) {
// // 		this.data = data
// // 	}
// // 	get_attr(name) {
// // 		return deepSearch(this, name)[name]
// // 	}
// // 	set_attr(key, value, options = { isRestrictive: false }) {
// // 		if (options.isRestrictive == true) {
// // 			return (deepSearch(this, key)[key] = value)
// // 		}
// // 		let obj = deepSearch(this, key)[key]
// // 		return (deepSearch(this, key)[key] = {
// // 			...obj,
// // 			...value,
// // 		})
// // 	}
// // }
