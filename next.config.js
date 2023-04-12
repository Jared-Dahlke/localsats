/** @type {import('next').NextConfig} */
const nextConfig = {
	i18n: {
		locales: ['en', 'es', 'de'],
		defaultLocale: 'en'
	},
	reactStrictMode: false, // this is required to be false for google-maps markers to work (until they upgrade to v3)
	typescript: {
		ignoreBuildErrors: true
	},
	async redirects() {
		return [
			{
				source: '/login', // the login page is no longer in use, so redirect to the home page
				destination: '/',
				permanent: true
			}
		]
	}
}

module.exports = nextConfig
