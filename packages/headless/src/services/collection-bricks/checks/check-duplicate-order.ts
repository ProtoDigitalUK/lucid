import T from "../../../translations/index.js";
import { APIError } from "../../../utils/app/error-handler.js";
import type { BrickObjectT } from "../../../schemas/bricks.js";

const checkDuplicateOrder = (bricks: Array<BrickObjectT>) => {
	const builderOrders = bricks
		.filter((brick) => brick.type === "builder")
		.map((brick) => brick.order);

	const builderOrderDuplicates = builderOrders.filter(
		(order, index) => builderOrders.indexOf(order) !== index,
	);

	if (builderOrderDuplicates.length > 0) {
		throw new APIError({
			type: "basic",
			name: T("error_saving_bricks"),
			message: T("error_saving_page_duplicate_order", {
				order: builderOrderDuplicates.join(", "),
			}),
			status: 400,
		});
	}
};

export default checkDuplicateOrder;
