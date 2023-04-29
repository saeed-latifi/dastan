import { useRouter } from "next/router";
import HTTPService from "./HTTPService";

export default function Interceptor({ children }) {
	const router = useRouter();

	HTTPService.interceptors.response.use(null, (error) => {
		if (error?.response?.status) {
			switch (error.response.status) {
				case 404:
					router.push("/404");
					break;
				case 401:
					router.push("/", null, { shallow: true });
					// toast.warning("bad request!");
					break;

				case 403:
					router.push("/", null, { shallow: true });
					// toast.warning("not access!");
					break;

				default:
					break;
			}
		} else {
			return Promise.reject(error);
		}
	});

	return <div>{children}</div>;
}
