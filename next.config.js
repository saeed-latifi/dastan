/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	swcMinify: true,
	// experimental: { appDir: true },
	typescript: {
		// ignoreBuildErrors: true
	},
	// crossOrigin: false,

	output: "standalone",
};

module.exports = nextConfig;
