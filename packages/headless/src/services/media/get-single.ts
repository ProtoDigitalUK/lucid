import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import formatMedia from "../../format/format-media.js";
import RepositoryFactory from "../../libs/repositories/index.js";

export interface ServiceData {
	id: number;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const MediaRepo = RepositoryFactory.getRepository(
		"media",
		serviceConfig.db,
	);

	const media = await MediaRepo.selectSingleById({
		id: data.id,
		config: serviceConfig.config,
	});

	if (media === undefined) {
		throw new APIError({
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

	return formatMedia({
		media: media,
		host: serviceConfig.config.host,
	});
};

export default getSingle;
