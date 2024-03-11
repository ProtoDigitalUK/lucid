import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import type { BrickObjectT } from "../../schemas/bricks.js";
import collectionBricksServices from "../collection-bricks/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

export interface ServiceData {
	id: number;
	bricks?: Array<BrickObjectT>;
}

const updateSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.bricks && data.bricks.length > 0) {
		await serviceWrapper(collectionBricksServices.upsertMultiple, false)(
			serviceConfig,
			{
				id: data.id,
				type: "multiple-page",
				bricks: data.bricks,
			},
		);
	}
};

export default updateSingle;
