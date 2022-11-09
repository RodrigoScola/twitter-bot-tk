import { Input, Textarea, Text } from "@chakra-ui/react"

export const FormInput = ({ name = "", label = "", isTextArea = false, props, handleChange, value, defaultValue }) => {
	const InputType = isTextArea == true ? Textarea : Input
	return (
		<>
			{label !== "" ? <Text>{label}</Text> : null}
			<InputType defaultValue={defaultValue} name={name} value={value} onChange={handleChange} {...props} />
		</>
	)
}
