const colors = require("./statics/theme-colors.json");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: colors,
			backgroundImage: {
				"theme-profile": "url('/images/profile.svg')",
				"theme-team-logo": "url('/images/team.svg')",
				"theme-course-image": "url('/images/course.svg')",
			},

			fontFamily: {
				// "yekan-bakh": ["yekan-bakh"],
			},
			minWidth: {
				"theme-small": "5rem",
				"theme-medium": "7rem",
			},
			rotate: {
				270: "270deg",
			},
			transitionProperty: {
				"theme-select": "max-height , opacity ",
				"theme-check": "scale , opacity ",
			},
			transitionDuration: {
				"theme-slow": "400ms",
			},
			minHeight: {
				input: "2.4rem",
			},
			maxHeight: {
				select: "9rem",
			},

			maxWidth: {
				theme: "36rem",
				form: "28rem",
			},
			borderRadius: {
				"theme-border": "0.4rem",
			},
			boxShadow: {
				"theme-dark": `0 0 0.1rem  0rem ${colors["theme-select"]}`,
			},

			fontFamily: {
				homa: ["homa"],
				esfahan: ["esfahan"],
			},
		},
	},
	plugins: [],
};
