import DateFormatter from "@components/dateFormatter";
import HeartIcon from "@components/icons/heart-icon";
import Navigation from "@components/navigation";
import { useCourseFeed } from "@hooks/feed/useCourseFeed";
import { useAccount } from "@hooks/useAccount";
import { coursePublicResType } from "@providers/prismaProviders/coursePrisma";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { staticURLs } from "statics/url";

export default function CourseName() {
	const { onLikeCourse, isValidating, isLoading, coursesInfo } = useCourseFeed();

	const { userInfo } = useAccount();

	const [freeze, setFreeze] = useState(false);

	const [course, setCourse] = useState<coursePublicResType>();

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
		<div className="flex flex-col gap-2 w-full p-2">
			<Navigation label="" path={staticURLs.client.feed.courses} />
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
							<HeartIcon isLike={likes[0]?.authorId === userInfo.id} onClick={onLike} />
						</span>
						<span>{likesCount}</span>
					</span>
					<span className="flex items-center gap-2">
						<span>last update : </span>
						<span>{<DateFormatter date={updatedAt} />}</span>
					</span>
				</p>
			</div>
			{image && <img className="aspect-video overflow-hidden  object-cover w-full" src={image} alt={title} />}

			{context && (
				<div
					className="ql-editor border border-theme-border rounded-theme-border w-full p-2"
					dangerouslySetInnerHTML={{ __html: context }}
				/>
			)}

			{lessons.length > 0 && (
				<div className="border border-theme-border rounded-theme-border w-full p-2">
					{lessons.map((lesson) => (
						<Link
							href={staticURLs.client.feed.lesson({ courseName: title, lessonName: lesson.content.title })}
							key={lesson.id}
						>
							<span>{lesson.content.title}</span>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
