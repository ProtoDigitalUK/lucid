import T from "../../../translations/index.js";
import { APIError, modelErrors } from "../../../utils/app/error-handler.js";
import { type HeadlessConfigT } from "../../../schemas/config.js";

const checkAssignedBricks = (
	config: HeadlessConfigT,
	assignedBricks: string[],
) => {
	const brickInstances = config.bricks || [];
	const brickKeys = brickInstances.map((b) => b.key);

	const invalidBricks = assignedBricks.filter((b) => !brickKeys.includes(b));
	if (invalidBricks.length > 0) {
		throw new APIError({
			type: "basic",
			name: T("invalid_brick_keys"),
			message: T("make_sure_all_assigned_bricks_are_valid"),
			status: 400,
			errors: modelErrors({
				assigned_bricks: {
					code: "invalid",
					message: T("make_sure_all_assigned_bricks_are_valid"),
					children: invalidBricks.map((b) => ({
						code: "invalid",
						message: T("brick_with_key_not_found", {
							key: b,
						}),
					})),
				},
			}),
		});
	}
};

export default checkAssignedBricks;
