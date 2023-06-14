import { iLessonCreate, iLessonUpdate } from "@models/iLesson";
import prismaProvider from "@providers/prismaProvider";

export type lessonResType = {
	id: number;
	title: string;
	videoUrl: string | null;
	courseId: number;
	duration: number;
};

export function lessonSelect() {
	return { id: true, courseId: true, title: true, videoUrl: true, duration: true };
}

export default class LessonPrismaProvider {
	// public
	async getSome({ courseId }: { courseId: number }): Promise<lessonResType[]> {
		return await prismaProvider.lesson.findMany({ where: { courseId }, select: lessonSelect() });
	}

	// panel
	async create({ body }: { body: iLessonCreate }): Promise<lessonResType> {
		const { title, courseId } = body;

		return await prismaProvider.lesson.create({
			data: { title, course: { connect: { id: courseId } } },
			select: lessonSelect(),
		});
	}

	async update({ body }: { body: iLessonUpdate; authorId: number }): Promise<lessonResType> {
		const { title, id } = body;
		return await prismaProvider.lesson.update({ data: { title }, select: lessonSelect(), where: { id } });
	}

	async updateVideo({ id, videoUrl, duration }: { id: number; videoUrl: string; duration: number }): Promise<lessonResType> {
		return await prismaProvider.lesson.update({ data: { videoUrl, duration }, select: lessonSelect(), where: { id } });
	}

	// internals
	async checkLessonAuthor({ lessonId }: { lessonId: number }) {
		return await prismaProvider.lesson.findFirst({
			where: { id: lessonId },
			select: { course: { select: { content: { select: { authorId: true } } } } },
		});
	}
}
