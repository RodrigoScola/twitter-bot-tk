import {
	useDisclosure,
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Box,
} from "@chakra-ui/react"
export const Alert = ({ submitFunction, content = "", title, openText, Openelement }) => {
	const { isOpen, onOpen, onClose } = useDisclosure()
	return (
		<>
			<Box onClick={onOpen}>{Openelement}</Box>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{title}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>{content}</ModalBody>

					<ModalFooter>
						<Button colorScheme="green" mr={3} onClick={onClose}>
							Close
						</Button>
						<Button colorScheme={"red"} onClick={submitFunction} variant="ghost">
							submit
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}
