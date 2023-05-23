// export type ORMResponse<T> = T | T[] | null | "ERR";

export interface iCRUD {
	getSome(body: any): any;
	getOne(id: number): any;
	create(body: any): any;
	update(id: number, body: any): any;
	delete(id: number): any;
}
