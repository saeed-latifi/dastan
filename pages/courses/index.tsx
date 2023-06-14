import CourseFeedCard from "@components/cards/course-feed-card";
import { useCourseFeed } from "@hooks/feed/useCourseFeed";
import React from "react";

export default function CourseFeed() {
	const { coursesInfo } = useCourseFeed();

	return (
		<div className="w-full flex flex-wrap p-1 gap-2 max-w-theme">
			{coursesInfo?.map((course) => (
				<CourseFeedCard key={course.id} course={course} />
			))}
		</div>
	);
}
