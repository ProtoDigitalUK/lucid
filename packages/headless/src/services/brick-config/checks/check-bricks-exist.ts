import T from "../../../translations/index.js";
import { APIError } from "../../../utils/error-handler.js";
import getConfig from "../../config.js";

export interface ServiceData {
	bricks: string[];
}

const checkBricksExist = async (data: ServiceData) => {
	const config = await getConfig();
	const builderInstances = config.bricks || [];

	for (const brick of data.bricks) {
		if (!builderInstances.find((b) => b.key === brick)) {
			throw new APIError({
				type: "basic",
				name: T("error_not_found_name", {
					name: T("brick"),
				}),
				message: T("make_sure_all_assigned_bricks_are_valid"),
				status: 500,
			});
		}
	}
};

export default checkBricksExist;
