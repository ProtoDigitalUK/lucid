import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import getConfig from "../../libs/config/get-config.js";
import brickConfigService from "./index.js";

export interface ServiceData {
	brick_key: string;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const config = await getConfig();
	const builderInstances = config.bricks || [];

	const instance = builderInstances.find((b) => b.key === data.brick_key);

	if (instance === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("brick"),
			}),
			message: T("error_not_found_message", {
				name: T("brick"),
			}),
			status: 404,
		});
	}

	const brick = await brickConfigService.getBrickData({
		instance: instance,
		query: {
			include: ["fields"],
		},
	});

	if (brick === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("brick"),
			}),
			message: T("error_not_found_message", {
				name: T("brick"),
			}),
			status: 404,
		});
	}

	return brick;
};

export default getSingle;
