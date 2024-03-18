export const getCookie = (name: string) => {
	const cookies = document.cookie.split("; ");
	const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
	return cookie?.split("=")[1];
};

export const clearCookie = (name: string) => {
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};
