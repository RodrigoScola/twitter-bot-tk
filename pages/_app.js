import { ChakraProvider, ColorModeProvider, ColorModeScript } from "@chakra-ui/react"
import "../styles/globals.css"

function MyApp({ Component, pageProps }) {
	return (
		<ChakraProvider resetCSS={false}>
			<Component {...pageProps} />
		</ChakraProvider>
	)
}

export default MyApp
