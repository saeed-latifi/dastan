export const staticURLs = {
	client: {
		panel: {
			course: {
				all: "/panel/course",
				add: "/panel/course/modify",
				update: ({ courseId }: { courseId: number }) => `/panel/course/modify?item=${courseId}`,
				image: ({ courseId }: { courseId: number }) => `/panel/course/image?item=${courseId}`,
				lesson: {
					add: ({ courseId }: { courseId: number }) => `/panel/course/${courseId}`,
					update: ({ courseId, lessonId }: { courseId: number; lessonId: number }) =>
						`/panel/course/${courseId}?item=${lessonId}`,
				},
			},
		},
	},
	server: {
		panel: {
			course: {
				image: "panel/course/image",
			},
		},
	},
};
