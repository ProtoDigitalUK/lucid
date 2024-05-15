import type { BooleanInt } from "../../../libs/db/types.js";
import type { BrickSchema } from "../../../schemas/collection-bricks.js";
import type { FieldSchemaType } from "../../../schemas/collection-fields.js";
import type { Config } from "../../../types.js";
import flattenFields, {
	type GroupInsertItem,
	type FieldInsertItem,
} from "./flatten-fields.js";

export interface BrickInsertItem extends BrickSchema {
	id?: number;
	fields: Array<FieldInsertItem>;
	groups: Array<GroupInsertItem>;
}

const formatInsertBricks = (props: {
	bricks?: Array<BrickSchema>;
	fields?: Array<FieldSchemaType>;
	documentId: number;
	localisation: Config["localisation"];
}): Array<BrickInsertItem> => {
	const bricksRes: Array<BrickInsertItem> = [];

	if (props.bricks !== undefined) {
		for (let i = 0; i < props.bricks.length; i++) {
			const brick = props.bricks[i];
			if (brick === undefined) continue;

			const flat = flattenFields(brick.fields ?? [], props.localisation);

			bricksRes.push({
				key: brick.key,
				order: brick.order,
				type: brick.type,
				open: brick.open,
				fields: flat.fields,
				groups: flat.groups,
			});
		}
	}

	if (props.fields !== undefined) {
		const flat = flattenFields(props.fields, props.localisation);
		bricksRes.push({
			type: "collection-fields",
			fields: flat.fields,
			groups: flat.groups,
		});
	}

	return bricksRes;
};

export default formatInsertBricks;
