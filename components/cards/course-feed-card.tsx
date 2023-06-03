import DateFormatter from "@components/dateFormatter";
import HeartIcon from "@components/icons/heart-icon";
import { useCourseFeed } from "@hooks/feed/useCourseFeed";
import { useAccount } from "@hooks/useAccount";
import { coursePublicResType } from "@providers/prismaProviders/coursePrisma";
import Link from "next/link";
import { useState } from "react";
import { bucketUrl } from "statics/keys";
import { staticURLs } from "statics/url";

export default function CourseFeedCard({ course }: { course: coursePublicResType }) {
	const { userInfo } = useAccount();
	const { onLikeCourse, isValidating, isLoading } = useCourseFeed();
	const [freeze, setFreeze] = useState(false);
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
		},
	} = course;

	async function onLike() {
		if (freeze) return;
		setFreeze(true);
		const isLike = likes[0]?.authorId !== userInfo.id;
		await onLikeCourse({ body: { isLike, contentId }, userId: userInfo.id });
		setFreeze(false);
	}

	const imageSrc = `${bucketUrl}/course/${id}.webp?v=${1}`;

	return (
		<article className="flex-1 min-w-[30%] flex flex-col border border-theme-border rounded-theme-border overflow-hidden ">
			{image ? (
				<img className="aspect-video overflow-hidden  object-cover w-full" src={imageSrc} alt={title} />
			) : (
				<img className="aspect-video overflow-hidden  object-contain w-full" src="/images/course.svg" alt={title} />
			)}
			<div className="flex flex-col p-2 gap-2 w-full border-t border-theme-border">
				{(isValidating || isLoading) && <span className="text-3xl">isValidating</span>}
				<h2> {title}</h2>
				<p>{description}</p>
				<Link href={staticURLs.client.feed.resume({ username: authorName })}>{authorName}</Link>
				<div className="flex items-center w-full justify-between">
					<span className="flex items-center gap-1">
						<span className="flex w-5">
							<HeartIcon isLike={likes[0]?.authorId === userInfo.id} onClick={onLike} />
						</span>
						<span>{likesCount}</span>
					</span>
					<span>{<DateFormatter date={updatedAt} />}</span>
				</div>
			</div>
		</article>
	);
}
{
	/* {context && <div dangerouslySetInnerHTML={{ __html: context }} />} */
}
