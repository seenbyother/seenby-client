const DEFAULT_API_BASE_URL = "http://13.210.112.34:8080/api";

export const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? DEFAULT_API_BASE_URL;
