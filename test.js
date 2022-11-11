const lodash = require("lodash")
const setDefaultparams = (obj, defaults = {}, props = { isStrict: false }) => {
	if (props.isStrict == true) {
		return {
			...defaults,
			...obj,
		}
	}
	return lodash.defaultsDeep(obj, defaults)
}
function deepSearch(object, key, predicate = null) {
	if (object.hasOwnProperty(key)) {
		if (predicate !== null) {
			return predicate(key, object)
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
const data = [
	{
		one: "two",
		tw: {
			thre: "dos",
			four: ["as"],
		},
		thre: {
			gaming: {
				trye: "yes",
			},
		},
	},
	{
		one: "tt",
		tw: {
			thre: "dos",
			four: ["as"],
		},
		thre: {
			gaming: {
				trye: "yes",
			},
		},
	},
	{
		one: "t3",
		tw: {
			thre: "dos",
			four: ["as"],
		},
		thre: {
			gaming: {},
		},
	},
]
const formatItem = (item, options = {}) => {
	let currItem = {}
	setDefaultparams(options, {
		returns: null,
		exclude: null,
		include: null,
	})
	if (Object.values(options).every((item) => item == null)) {
		return item
	}
	if (lodash.isNil(options)) {
		return item
	}
	if (options.include !== null) {
		if (typeof options.include == "string") {
			let nitem = deepSearch(item, options.include)
			nitem !== null
				? (currItem[options.include] = nitem[options.include])
				: (currItem[options.include] = null)
			console.log(currItem)
		} else if (lodash.isArray(options.include)) {
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
		} else if (lodash.isArray(options.exclude)) {
			options.exclude.forEach((key) => {})
		}
	}

	if (options.returns !== null) {
		const haskey = deepSearch(item, options.returns, (key, value) => value)
		if (haskey !== null) {
			return haskey[options.returns] !== null ? haskey[options.returns] : null
		}
		return null
	}
	return currItem !== {} ? currItem : item
}

const formatItems = (items, options) => {
	let nitems = []
	items.forEach((item) => {
		const curr = formatItem(item, options)
		nitems.push(curr)
	})
	return nitems
}
console.log(
	formatItems(data, {
		include: "four",
	})
)