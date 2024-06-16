import T from "../../translations/index.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceFn } from "../../libs/services/types.js";
import type { MediaResponse } from "../../types/response.js";

const getSingle: ServiceFn<
	[
		{
			id: number;
		},
	],
	MediaResponse
> = async (serviceConfig, data) => {
	const MediaRepo = Repository.get("media", serviceConfig.db);
	const MediaFormatter = Formatter.get("media");

	const media = await MediaRepo.selectSingleById({
		id: data.id,
		config: serviceConfig.config,
	});

	if (media === undefined) {
		return {
			error: {
				type: "basic",
				name: T("error_not_found_name", {
					name: T("media"),
				}),
				message: T("error_not_found_message", {
					name: T("media"),
				}),
				status: 404,
			},
			data: undefined,
		};
	}

	return {
		error: undefined,
		data: MediaFormatter.formatSingle({
			media: media,
			host: serviceConfig.config.host,
		}),
	};
};

export default getSingle;
