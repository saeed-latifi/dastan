/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				select: "#4200DC",
				border: "#B8AF00",
				light: "#FEFFD3",
				dark: "#12011D",
				warn: "#AB2B00",
				shade: "#443A61",
				accent: "#E6EE00",
			},

			fontFamily: {
				// "yekan-bakh": ["yekan-bakh"],
			},
			minWidth: {
				button: "7rem",
			},
			rotate: {
				270: "270deg",
			},
			transitionProperty: {
				border: "max-height , opacity ",
			},
			minHeight: {
				input: "2.4rem",
			},
			maxHeight: {
				select: "9rem",
			},
			borderRadius: {
				input: "0.4rem",
			},
		},
	},
	plugins: [],
};
