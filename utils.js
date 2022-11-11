import _ from "lodash"
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
export const setDefaultparams = (obj, defaults = {}, props = { isStrict: false, remoeNull: false }) => {
	obj = _.omitBy(obj, _.isNil)
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
	return _.omitBy(defaults, _.isNil)
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

export const formatItem = (
	item,
	options = {
		returns: null,
		exclude: null,
		include: null,
	}
) => {
	let currItem = {}
	setDefaultparams(options, {
		returns: null,
		exclude: null,
		include: null,
	})
	if (Object.values(options).every((item) => item == null)) {
		return item
	}
	if (_.isNil(options)) {
		return item
	}
	if (options.include !== null) {
		if (typeof options.include == "string") {
			let nitem = deepSearch(item, options.include)
			nitem !== null
				? (currItem[options.include] = nitem[options.include])
				: (currItem[options.include] = null)
		} else if (_.isArray(options.include)) {
			options.include.forEach((key) => {
				let nitem = deepSearch(item, key)
				nitem !== null ? (currItem[key] = nitem[key]) : (currItem[key] = null)
				console.log(currItem)
			})
		}
	}

	if (options.exclude !== null) {
		if (typeof options.exclude == "string") {
			const haskey = deepSearch(item, options.exclude, (key, obj) => {
				delete obj[key]
			})
			console.log(item)
		} else if (_.isArray(options.exclude)) {
			options.exclude.forEach((key) => {})
		}
	}

	if (options.returns !== null) {
		const haskey = deepSearch(item, options.returns, (key, value) => value)
		if (haskey !== null) {
			return haskey[options.returns] !== null ? haskey[options.returns] : null
		}
	}

	return currItem
}

export const formatItems = (items, options) => {
	let nitems = []
	items.forEach((item) => {
		const curr = formatItem(item, options)
		nitems.push(curr)
	})
	return nitems
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
