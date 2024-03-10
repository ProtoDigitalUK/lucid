import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import type { BrickObjectT } from "../../schemas/bricks.js";

export interface ServiceData {
	id: number;
	bricks?: Array<BrickObjectT>;
}

const updateSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	console.log(data.bricks);
};

export default updateSingle;
