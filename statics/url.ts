export const staticClientURL = {
	panel: {
		course: {
			all: "/panel/course",
			add: "/panel/course/modify",
			update: ({ courseId }: { courseId: number }) => `/panel/course/modify?item=${courseId}`,
			image: ({ courseId }: { courseId: number }) => `/panel/course/image?item=${courseId}`,
		},
	},
};
