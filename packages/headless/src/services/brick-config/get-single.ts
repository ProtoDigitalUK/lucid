import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import getConfig from "../config.js";
import brickConfigService from "./index.js";

export interface ServiceData {
	brickKey: string;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const config = await getConfig();
	const builderInstances = config.bricks || [];

	const instance = builderInstances.find((b) => b.key === data.brickKey);

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
