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
	},
	async headers() {
		return [
			{
				// matching all API routes
				source: '/api/:path*',
				headers: [
					{ key: 'Access-Control-Allow-Credentials', value: 'true' },
					{ key: 'Access-Control-Allow-Origin', value: '*' },
					{
						key: 'Access-Control-Allow-Methods',
						value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT'
					},
					{
						key: 'Access-Control-Allow-Headers',
						value:
							'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
					}
				]
			}
		]
	}
}

module.exports = nextConfig
