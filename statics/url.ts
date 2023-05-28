export const staticURLs = {
	client: {
		home: "/",
		welcome: "/welcome",
		login: "/login",
		checkYourEmail: "/check-your-email",
		Forbidden: "/403",
		Unauthorized: "/401",
		verify: "/verify",
		signUp: "/sign-up",
		recoverPassword: "/recover-password",
		reSendActivationEmail: "/resend-activation-email",

		profile: {
			base: "/profile",
			OTPCheck: "/profile/otp-check",
			addImage: "/profile/add-image",
			changePassword: "/profile/change-password",
			changeEmail: "/profile/change-email/",
			addPhone: "/profile/add-phone",
		},

		panel: {
			course: {
				all: "/panel/course",
				add: "/panel/course/modify",
				one: ({ courseId }: { courseId: number }) => `/panel/course/modify?item=${courseId}`,
				image: ({ courseId }: { courseId: number }) => `/panel/course/image?item=${courseId}`,
				lesson: {
					add: ({ courseId }: { courseId: number }) => `/panel/course/${courseId}`,
					one: ({ courseId, lessonId }: { courseId: number; lessonId: number }) =>
						`/panel/course/${courseId}?item=${lessonId}`,
				},
			},

			team: {
				all: "/panel/team",
				add: "/panel/team/modify",
				one: ({ teamId }: { teamId: number }) => `/panel/team/modify?item=${teamId}`,
				image: ({ teamId }: { teamId: number }) => `/panel/team/image?item=${teamId}`,
				job: {
					add: ({ teamId }: { teamId: number }) => `/panel/team/${teamId}`,
					one: ({ teamId, jobId }: { teamId: number; jobId: number }) => `/panel/team/${teamId}?item=${jobId}`,
				},
			},
		},
	},

	server: {
		panel: {
			course: {
				image: "panel/course/image",
				base: "panel/course",
			},
			lesson: {
				base: "panel/lesson",
			},
			team: { base: "panel/team", image: "panel/team/image" },
			job: { base: "panel/job" },
		},
		account: {
			base: "account",
			password: "account/password",
			email: "account/email",
			phone: "account/phone",
			image: "account/image",
		},

		public: {
			province: {
				base: "public/province",
			},
			category: {
				base: "public/category",
			},
		},
	},
};
