/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false, // this is required to be false for google-maps markers to work (until they upgrade to v3)
	typescript: {
		ignoreBuildErrors: true
	}
}

module.exports = nextConfig
