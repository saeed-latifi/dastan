import axios from "axios";
const HTTPService = axios.create({ baseURL: "/api/" });

export default HTTPService;
