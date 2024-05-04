import T from "../../../translations/index.js";
import { LucidAPIError } from "../../../utils/error-handler.js";
import type { BrickInsertItem } from "../helpers/format-insert-bricks.js";

const checkDuplicateOrder = (bricks: Array<BrickInsertItem>) => {
	const builderOrders = bricks
		.filter((brick) => brick.type === "builder")
		.map((brick) => brick.order);

	const builderOrderDuplicates = builderOrders.filter(
		(order, index) => builderOrders.indexOf(order) !== index,
	);

	if (builderOrderDuplicates.length > 0) {
		throw new LucidAPIError({
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
