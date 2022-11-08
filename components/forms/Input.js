import { Box, Input, Textarea, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useForm } from "../../hooks/useForm"

export const FormInput = ({ name = "", label = "", isTextArea = false, props, handleChange, value }) => {
	const InputType = isTextArea == true ? Textarea : Input
	return (
		<>
			{label !== "" ? <Text>{label}</Text> : null}
			<InputType name={name} value={value} onChange={handleChange} {...props} />
		</>
	)
}
