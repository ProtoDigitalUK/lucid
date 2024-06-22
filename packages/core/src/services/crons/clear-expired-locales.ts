import { subDays } from "date-fns";
import Repository from "../../libs/repositories/index.js";
import type { ServiceFn } from "../../utils/services/types.js";

/*
    After 30 days of inactivity, non-active locales will be deleted from the database.
*/

const clearExpiredLocales: ServiceFn<[], undefined> = async (context) => {
	const LocalesRepo = Repository.get("locales", context.db);

	const now = new Date();
	const thirtyDaysAgo = subDays(now, 30);
	const thirtyDaysAgoTimestamp = thirtyDaysAgo.toISOString();

	await LocalesRepo.deleteMultiple({
		where: [
			{
				key: "is_deleted_at",
				operator: "<",
				value: thirtyDaysAgoTimestamp,
			},
		],
	});

	return {
		error: undefined,
		data: undefined,
	};
};

export default clearExpiredLocales;
