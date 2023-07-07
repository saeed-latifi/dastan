import axios, { AxiosError, AxiosResponse } from "axios";
import Router from "next/router";

export const takeNumber = 3;
const HTTPService = axios.create({ baseURL: "/api/" });

export default HTTPService;

HTTPService.interceptors.response.use(
	(response: AxiosResponse) => response,
	(error: AxiosError) => {
		return new Promise(async (resolve, reject) => {
			if (error.response) {
				switch (error.response.status) {
					case 404:
						break;
					case 401:
						break;
					case 403:
						await Router.replace("/login");
						break;
					default:
						break;
				}
			}
			reject(error);
		});
	}
);
