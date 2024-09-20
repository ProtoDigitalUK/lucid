import T from "../../../translations/index.js";
import Repository from "../../../libs/repositories/index.js";
import constants from "../../../constants/constants.js";
import { addMilliseconds } from "date-fns";
import type { ServiceFn } from "../../../utils/services/types.js";

const checkAwaitingSync: ServiceFn<
	[
		{
			key: string;
		},
	],
	true
> = async (context, data) => {
	const MediaAwaitingSyncRepo = Repository.get(
		"media-awaiting-sync",
		context.db,
	);

	const awaitingSync = await MediaAwaitingSyncRepo.selectSingle({
		select: ["key"],
		where: [
			{
				key: "key",
				operator: "=",
				value: data.key,
			},
			{
				key: "timestamp",
				operator: ">",
				value: addMilliseconds(
					new Date(),
					constants.mediaAwaitingSyncInterval * -1,
				).toISOString(),
			},
		],
	});

	if (!awaitingSync) {
		return {
			error: {
				type: "basic",
				status: 400,
				errorResponse: {
					body: {
						file: {
							code: "media_error",
							message: T("media_error_not_awaiting_sync"),
						},
					},
				},
			},
			data: undefined,
		};
	}

	return {
		error: undefined,
		data: true,
	};
};

export default checkAwaitingSync;
