export const staticURLs = {
	client: {
		home: "/",
		course: "/course",

		welcome: "/welcome",
		login: "/login",
		EmailCheck: "/check-email",
		Forbidden: "/403",
		Unauthorized: "/401",
		verify: "/verify",
		signUp: "/sign-up",
		recoverPassword: "/recover-password",
		reSendActivationEmail: "/resend-activation-email",

		account: {
			base: "/account",
			OTPCheck: "/account/otp-check",
			addImage: "/account/add-image",
			changePassword: "/account/change-password",
			changeEmail: "/account/change-email/",
			addPhone: "/account/add-phone",
			resetPassword: "/account/reset-password",
			confirmNewEmail: "/account/confirm-new-email",
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
					addVideo: ({ courseId, lessonId }: { courseId: number; lessonId: number }) =>
						`/panel/course/${courseId}/${lessonId}`,
					showVideo: ({ courseId, lessonId }: { courseId: number; lessonId: number }) =>
						`/panel/course/${courseId}/${lessonId}/video`,
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

		feed: {
			courses: "/courses",
			course: ({ courseName }: { courseName: string }) => `/courses/${courseName}`,
			lesson: ({ courseName, lessonName }: { courseName: string; lessonName: string }) => `/courses/${courseName}/${lessonName}`,

			resume: ({ username }: { username: string }) => `/resume/${username}`,
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
				video: "panel/lesson/video",
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

		feed: {
			course: {
				all: "feed/course",
			},
			resume: "feed/resume",
			like: "feed/like",
			follow: "feed/follow",
		},
	},
};
