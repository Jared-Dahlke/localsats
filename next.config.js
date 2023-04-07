/** @type {import('next').NextConfig} */
const nextConfig = {
	i18n: {
		locales: ['en', 'es', 'de'],
		defaultLocale: 'en'
	},
	reactStrictMode: false, // this is required to be false for google-maps markers to work (until they upgrade to v3)
	typescript: {
		ignoreBuildErrors: true
	}
}

module.exports = nextConfig
