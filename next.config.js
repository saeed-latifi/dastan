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
	images: { domains: ["https://dastan.storage.iran.liara.space", "liara", "dastan", "dastan.storage.iran.liara.space"] },
};

module.exports = nextConfig;
