import T from "../../translations/index.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceFn } from "../../utils/services/types.js";
import type { MediaResponse } from "../../types/response.js";

const getSingle: ServiceFn<
	[
		{
			id: number;
		},
	],
	MediaResponse
> = async (service, data) => {
	const MediaRepo = Repository.get("media", service.db);
	const MediaFormatter = Formatter.get("media");

	const media = await MediaRepo.selectSingleById({
		id: data.id,
		config: service.config,
	});

	if (media === undefined) {
		return {
			error: {
				type: "basic",
				message: T("media_not_found_message"),
				status: 404,
			},
			data: undefined,
		};
	}

	return {
		error: undefined,
		data: MediaFormatter.formatSingle({
			media: media,
			host: service.config.host,
		}),
	};
};

export default getSingle;
