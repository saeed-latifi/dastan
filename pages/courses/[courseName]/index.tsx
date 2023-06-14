import DateFormatter from "@components/dateFormatter";
import HeartIcon from "@components/icons/heart-icon";
import CourseImage from "@components/images/course-image";
import Navigation from "@components/navigation";
import { useCourseFeed } from "@hooks/feed/useCourseFeed";
import { useAccount } from "@hooks/useAccount";
import { coursePublicResType } from "@providers/prismaProviders/coursePrisma";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { staticURLs } from "statics/url";

export default function CourseName() {
	const { onLikeCourse, isValidating, isLoading, coursesInfo } = useCourseFeed();
	const { userInfo } = useAccount();

	const [freeze, setFreeze] = useState(false);
	const [course, setCourse] = useState<coursePublicResType>();
	const [selected, setSelected] = useState(-1);

	const router = useRouter();

	useEffect(() => {
		if (coursesInfo) {
			coursesInfo.map((course) => {
				if (course.content.title === router.query.courseName) {
					setCourse(course);
				}
			});
		}
	}, [coursesInfo, router]);

	async function onLike() {
		if (!userInfo) return toast.warn("please log in first");
		if (freeze) return;
		setFreeze(true);
		const isLike = likes[0]?.authorId !== userInfo.id;
		await onLikeCourse({ body: { isLike, contentId }, userId: userInfo.id });
		setFreeze(false);
	}

	if (!course) return <div>no valid record</div>;

	const {
		id,
		content: {
			id: contentId,
			author: { id: authorId, username: authorName },
			_count: { likes: likesCount },
			description,
			likes,
			title,
			updatedAt,
			image,
			category,
			context,
			createdAt,
		},
		lessons,
	} = course;

	return (
		<div className="flex flex-col gap-2 w-full p-2 max-w-theme	">
			<Navigation label="" path={staticURLs.client.feed.courses} />
			{image && <CourseImage image={image} />}
			<div className="flex flex-col gap-2 border border-theme-border rounded-theme-border w-full p-2">
				<p>{title}</p>
				<p>{description}</p>
				<p className="flex items-center gap-1">
					<span>author : </span>
					<Link href={staticURLs.client.feed.resume({ username: authorName })}>{authorName}</Link>
				</p>

				<p className="flex items-center gap-2">
					<span>category : </span>
					<span>{category.title}</span>
				</p>

				<p className="flex items-center gap-2 w-full justify-between">
					<span className="flex items-center gap-2">
						<span className="flex w-5">
							<HeartIcon isLike={userInfo ? likes[0]?.authorId === userInfo.id : false} onClick={onLike} />
						</span>
						<span>{likesCount}</span>
					</span>
					<span className="flex items-center gap-2">
						<span>last update : </span>
						<span>{<DateFormatter date={updatedAt} />}</span>
					</span>
				</p>
			</div>

			{context && (
				<div
					className="ql-editor border border-theme-border rounded-theme-border w-full p-2"
					dangerouslySetInnerHTML={{ __html: context }}
				/>
			)}

			{lessons.length > 0 && (
				<div className="flex flex-col border border-theme-border rounded-theme-border w-full overflow-hidden">
					{lessons.map((lesson) => (
						<div
							className={`flex flex-col w-full items-center border-b border-theme-border last:border-b-0 ${
								lesson.videoUrl && selected === lesson.id ? "bg-theme-select text-theme-accent" : ""
							}`}
							key={lesson.id}
							onClick={() => {
								setSelected(lesson.id);
							}}
						>
							{lesson.videoUrl && selected === lesson.id && (
								<video
									src={lesson.videoUrl}
									height="auto"
									width={"100%"}
									controls
									id="video-player"
									className=""
								/>
							)}
							<p className="flex justify-between w-full items-center p-2">
								<span>{lesson.title}</span>
								<span>{lesson.duration}</span>
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
