/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true
	},
	env: {
		NEXT_PUBLIC_MONGODB_URI: process.env.NEXT_PUBLIC_MONGODB_URI
	}
}

module.exports = nextConfig
