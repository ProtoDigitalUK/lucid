import type { BrickInsertItem } from "./format-insert-bricks.js";
import type { GroupInsertItem, FieldInsertItem } from "./flatten-fields.js";

const formatPostInsertBricks = (
	bricks: Array<BrickInsertItem>,
	insertedBricks: Array<{
		id: number;
		brick_type: "builder" | "fixed" | "collection-fields";
		brick_key: string | null;
		brick_order: number | null;
	}>,
): {
	id: number;
	key: string | undefined;
	order: number | undefined;
	type: "builder" | "fixed" | "collection-fields";
	groups: GroupInsertItem[];
	fields: FieldInsertItem[];
}[] =>
	bricks
		.map((brick) => {
			const foundBrick = insertedBricks.find(
				(res) =>
					res.brick_key === (brick.key ?? null) &&
					res.brick_order === (brick.order ?? null) &&
					res.brick_type === brick.type,
			);

			if (!foundBrick) {
				return null;
			}

			return {
				id: foundBrick.id,
				key: brick.key,
				order: brick.order,
				type: brick.type,
				groups: brick.groups,
				fields: brick.fields,
			};
		})
		// TODO: remove as when Typescript 5.5 is released
		.filter((b) => b !== null) as {
		id: number;
		key: string | undefined;
		order: number | undefined;
		type: "builder" | "fixed" | "collection-fields";
		groups: GroupInsertItem[];
		fields: FieldInsertItem[];
	}[];

export default formatPostInsertBricks;
