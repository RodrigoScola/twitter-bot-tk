/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	compiler: {
		styledComponents: true,
	},
	webpack: (config) => {
		config.experiments = { ...config.experiments, ...{ topLevelAwait: true } }
		return config
	},
}

module.exports = nextConfig
