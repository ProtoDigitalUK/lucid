import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import type { BrickObjectT } from "../../schemas/bricks.js";
import formatUpsertFields from "../../format/format-upsert-fields.js";
import collectionBrickServices from "./index.js";

export interface ServiceData {
	bricks: Array<BrickObjectT>;
	groups: Awaited<
		ReturnType<typeof collectionBrickServices.upsertMultipleGroups>
	>;
}

const upsertMultipleFields = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const fields = data.bricks.flatMap((brick) =>
		formatUpsertFields(brick, data.groups),
	);
};

export default upsertMultipleFields;
