// export type ORMResponse<T> = T | T[] | null | "ERR";

export interface iCRUD {
	getSome(...body: any): any;
	getOne(...body: any): any;
	create(...body: any): any;
	update(...body: any): any;
	delete(...body: any): any;
}
