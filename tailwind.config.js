const colors = require("./statics/theme-colors.json");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: colors,

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
			boxShadow: {
				"theme-input": `0 0 0.1rem  0rem ${colors["theme-select"]}`,
			},
		},
	},
	plugins: [],
};
