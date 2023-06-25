import AddComment from "@components/comments/add-comment";
import CommentCard, { commentEditType, commentReplyType } from "@components/comments/commentCard";
import DateFormatter from "@components/dateFormatter";
import HeartIcon from "@components/icons/heart-icon";
import CourseImage from "@components/images/course-image";
import Navigation from "@components/navigation";
import { useCourseFeed } from "@hooks/feed/useCourseFeed";
import { useAccount } from "@hooks/useAccount";
import { useComment } from "@hooks/useComment";
import { coursePublicResType } from "@providers/prismaProviders/coursePrisma";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { staticURLs } from "statics/url";

export default function CourseName() {
	const [course, setCourse] = useState<coursePublicResType>();
	const [ediInfo, setEdit] = useState<commentEditType>();
	const [replyInfo, setReply] = useState<commentReplyType>();

	const { onLikeCourse, isValidating, isLoading, coursesInfo } = useCourseFeed();
	const {
		commentInfo,
		isLoading: commentIsLoading,
		isValidating: commentIsValidating,
		onDelete,
		getReplies,
	} = useComment({ contentId: course?.content.id });
	const { userInfo } = useAccount();

	const [freeze, setFreeze] = useState(false);
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
	const focusId = "commentInputFocus";
	return (
		<div className="flex flex-col gap-4 w-full p-2 max-w-theme">
			<Navigation label="" path={staticURLs.client.feed.courses} />
			{image && <CourseImage image={image} />}
			<div className="flex flex-col gap-2 border border-theme-border rounded-theme-border w-full p-2">
				<p>{title}</p>
				<p>{description}</p>
				<div className="flex items-center gap-1">
					<span>author : </span>
					<Link href={staticURLs.client.feed.resume({ username: authorName })}>{authorName}</Link>
				</div>

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
				></div>
			)}
			{lessons.length > 0 && (
				<div className="flex flex-col border border-theme-border rounded-theme-border w-full overflow-hidden">
					{lessons.map((lesson) => (
						<div
							key={lesson.id}
							onClick={() => setSelected(lesson.id)}
							className={`flex flex-col w-full items-center border-b border-theme-border last:border-b-0 ${
								lesson.videoUrl && selected === lesson.id ? "bg-theme-select text-theme-accent" : ""
							}`}
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

			{commentInfo && commentInfo.length > 0 && (
				<div className="flex flex-col gap-1">
					<p>comments</p>
					<div className="flex flex-col border border-theme-border rounded-theme-border w-full overflow-hidden p-2">
						{commentInfo.map((comment) => (
							// TODO ask first for delete
							<>
								<CommentCard
									key={"com" + comment.id}
									comment={comment}
									onDelete={onDelete}
									onEdit={setEdit}
									onReply={setReply}
									onGetReplies={getReplies}
									focusId={focusId}
								/>
								{comment.children?.map((comment) => (
									<CommentCard
										isReply
										key={"rep" + comment.id}
										comment={comment}
										onDelete={onDelete}
										onEdit={setEdit}
										onReply={setReply}
										focusId={focusId}
									/>
								))}
							</>
						))}
					</div>
				</div>
			)}
			<AddComment contentId={course.content.id} editInfo={ediInfo} replyInfo={replyInfo} focusId={focusId} />
		</div>
	);
}
