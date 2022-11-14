import { Box, ChakraProvider, ColorModeProvider, ColorModeScript } from "@chakra-ui/react"
import "../styles/globals.css"


function MyApp({ Component, pageProps }) {
	return (
		<ChakraProvider resetCSS={false}>
			<Box w={"1000px"} m={"auto"} pt={6}>
				<Component {...pageProps} />
			</Box>
		</ChakraProvider>
	)
}

export default MyApp
