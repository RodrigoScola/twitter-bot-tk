import { useState } from "react"
export const useForm = (initialValues) => {
	const [values, setValues] = useState(initialValues)
	const setNewValue = (e) => {
		setValues({ ...values, [e.target.name]: e.target.value })
	}
	return [values, setNewValue]
}
