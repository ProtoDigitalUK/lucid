import T from "../../translations/index.js";
import { HeadlessAPIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";

export interface ServiceData {
	id: number;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const MediaRepo = Repository.get("media", serviceConfig.db);
	const MediaFormatter = Formatter.get("media");

	const media = await MediaRepo.selectSingleById({
		id: data.id,
		config: serviceConfig.config,
	});

	if (media === undefined) {
		throw new HeadlessAPIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("media"),
			}),
			message: T("error_not_found_message", {
				name: T("media"),
			}),
			status: 404,
		});
	}

	return MediaFormatter.formatSingle({
		media: media,
		host: serviceConfig.config.host,
	});
};

export default getSingle;
