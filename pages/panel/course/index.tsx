import ButtonBase from "@components/common/base-button";
import LoadingSpinner from "@components/common/loader-spinner";
import FormSection from "@components/forms/form-section";
import { useCoursePanel } from "@hooks/panel/useCoursePanel";
import { useAccount } from "@hooks/useAccount";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { staticURLs } from "statics/url";

export default function Courses() {
	const router = useRouter();
	const { checkAccessAndRedirect } = useAccount();
	checkAccessAndRedirect();

	const { coursesInfo, isLoading } = useCoursePanel();

	if (isLoading) return <LoadingSpinner />;

	return (
		<div className="flex flex-col gap-4 w-full max-w-md py-4">
			<ButtonBase type="button" onClick={() => router.push(staticURLs.client.panel.course.add)}>
				add new course
			</ButtonBase>

			{coursesInfo && coursesInfo.length > 0 && (
				<FormSection title="your courses">
					{coursesInfo.map((course, index) => {
						console.log(course);

						return (
							<div key={index} className="flex items-center justify-between gap-2">
								<Link href={staticURLs.client.panel.course.one({ courseId: course.id })}>
									{course.content.title}
								</Link>
							</div>
						);
					})}
				</FormSection>
			)}
		</div>
	);
}
