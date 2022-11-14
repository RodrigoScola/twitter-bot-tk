import {
	Flex,
	Avatar,
	Text,
	Button,
	ButtonGroup,
	AccordionButton,
	AccordionPanel,
	AccordionItem,
} from "@chakra-ui/react"
import { FormInput } from "./Input"
import { Alert } from "./Alert"
import { db } from "../../db/database"
import { tfront } from "../../db/TwitterApiFrontend"
export const AccountComponent = ({ item, setValue, tweetcontent }) => {
	return (
		<>
			<Flex justifyContent={"space-between"}>
				<AccordionButton
					bg={"transparent"}
					w={"80%"}
					display={"flex"}
					justifyContent={"space-between"}
					border={"none"}
				>
					<Flex alignItems={"center"}>
						<Avatar src={item?.meta?.profile_image_url} />
						<Text fontFamily={"Poppins"} pl={2}>
							{item.content}
						</Text>
					</Flex>
					<Flex w={"20%"} justifyContent={"space-between"}>
						<Alert
							submitFunction={async () => {
								await db.deletePost(item.id)

								// window.location.href = "/"
							}}
							Openelement={<Button colorScheme={"red"}>Delete</Button>}
							title="are you sure you want to delete this account?"
							content="This action is irreversible and cannot be changed"
						/>
						<Alert
							submitFunction={() => {
								tfront.tweet(tweetcontent)
							}}
							Openelement={<Button colorScheme={"twitter"}>Tweet</Button>}
							title={`Tweet at ` + item.content}
							content={
								<>
									<form>
										<FormInput
											defaultValue={`@${item.content} `}
											name="tweetcontent"
											isTextArea={"true"}
											handleChange={setValue}
										/>
									</form>
								</>
							}
						/>
					</Flex>
				</AccordionButton>
			</Flex>
			<AccordionPanel>
				<Text>{item?.content}&apos;s last tweet</Text>
				<Flex>
					<Text>{item?.meta?.lastTweet?.text}</Text>
				</Flex>
				<ButtonGroup>
					<Alert
						submitFunction={async () => {
							await tfront.reply(tweetcontent, item?.meta?.lastTweet?.id, item.id)
						}}
						Openelement={<Button colorScheme={"whatsapp"}>Reply</Button>}
						title={`Reply to ` + item?.content}
						content={
							<>
								<form>
									<FormInput
										defaultValue={``}
										name="tweetcontent"
										isTextArea={"true"}
										handleChange={setValue}
									/>
								</form>
							</>
						}
					/>
					<Button>Retweet</Button>
				</ButtonGroup>
			</AccordionPanel>
		</>
	)
}
