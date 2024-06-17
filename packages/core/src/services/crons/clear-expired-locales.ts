import type { ServiceFn } from "../../libs/services/types.js";

/*
    After 30 days of inactivity, non-active locales will be deleted from the database.
*/

const clearExpiredLocales: ServiceFn<[], undefined> = async (service) => {
	return {
		error: undefined,
		data: undefined,
	};
};

export default clearExpiredLocales;
