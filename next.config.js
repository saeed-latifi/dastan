/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	swcMinify: true,
	// experimental: { appDir: true },
	typescript: {
		// ignoreBuildErrors: true
	},
	// crossOrigin: false,
	async redirects() {
		// TODO sync it
		return [
			{
				source: "/images/profile/:slug/:number.webp",
				destination: process.env.BUCKET_URL + "/profile/:slug.webp",
				permanent: true,
			},
		];
	},
	output: "standalone",
};

module.exports = nextConfig;
