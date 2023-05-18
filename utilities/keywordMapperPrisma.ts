export function prismaKeywordCreateHandler({ keywords, authorId }: { keywords?: string[]; authorId: number }) {
	return {
		connectOrCreate: keywords?.map((keyword) => ({ where: { title: keyword.trim() }, create: { title: keyword.trim(), authorId } })),
	};
}

export function prismaKeywordUpdateHandler({ keywords, authorId }: { keywords?: string[]; authorId: number }) {
	return {
		connectOrCreate: keywords?.map((keyword) => ({ where: { title: keyword.trim() }, create: { title: keyword.trim(), authorId } })),
		set: keywords?.map((keyword) => ({ title: keyword.trim() })),
	};
}
