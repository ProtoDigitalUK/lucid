import T from "../../../translations/index.js";
import { LucidAPIError } from "../../../utils/error-handler.js";
import type { BrickInsertItem } from "./format-insert-bricks.js";

const formatPostInsertBricks = (
	bricks: Array<BrickInsertItem>,
	insertedBricks: Array<{
		id: number;
		brick_type: "builder" | "fixed" | "collection-fields";
		brick_key: string | null;
		brick_order: number | null;
	}>,
) =>
	bricks.map((brick) => {
		const foundBrick = insertedBricks.find(
			(res) =>
				res.brick_key === (brick.key ?? null) &&
				res.brick_order === (brick.order ?? null) &&
				res.brick_type === brick.type,
		);

		if (!foundBrick) {
			throw new LucidAPIError({
				type: "basic",
				name: T("error_saving_bricks"),
				message: T("there_was_an_error_updating_bricks"),
				status: 400,
			});
		}

		return {
			id: foundBrick.id,
			key: brick.key,
			order: brick.order,
			type: brick.type,
			groups: brick.groups,
			fields: brick.fields,
		};
	});

export default formatPostInsertBricks;
