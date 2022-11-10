const lodash = require("lodash")
const setDefaultparams = (obj, defaults = {}, props = { isStrict: false }) => {
	if (props.isStrict == true) {
		return {
			...defaults,
			...obj,
		}
	}
	obj = lodash.omitBy(obj, lodash.isNil)
	Object.keys(defaults).map((v, i) => {
		if (obj.hasOwnProperty(v)) {
			defaults[v] = obj[v]
		}
	})
	return defaults
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
