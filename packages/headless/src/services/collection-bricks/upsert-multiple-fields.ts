import type { BrickObjectT } from "../../schemas/bricks.js";
import formatUpsertFields from "../../format/format-upsert-fields.js";
import type { GroupsResT } from "./upsert-multiple-groups.js";

export interface ServiceData {
	bricks: Array<BrickObjectT>;
	groups: Array<GroupsResT>;
}

const upsertMultipleFields = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	// format fields
	const fields = data.bricks.flatMap((brick) =>
		formatUpsertFields(brick, data.groups),
	);

	if (fields.length === 0) {
		return;
	}

	// upsert fields
	const fieldsRes = await serviceConfig.db
		.insertInto("headless_fields")
		.values(
			fields.map((field) => {
				return {
					fields_id: field.fields_id ?? undefined,
					collection_brick_id: field.collection_brick_id,
					key: field.key,
					type: field.type,
					group_id: field.group_id,
					text_value: field.text_value,
					int_value: field.int_value,
					bool_value: field.bool_value,
					json_value: field.json_value
						? JSON.stringify(field.json_value)
						: null,
					page_link_id: field.page_link_id,
					media_id: field.media_id,
					language_id: field.language_id,
				};
			}),
		)
		.onConflict((oc) =>
			oc.column("fields_id").doUpdateSet((eb) => ({
				text_value: eb.ref("excluded.text_value"),
				int_value: eb.ref("excluded.int_value"),
				bool_value: eb.ref("excluded.bool_value"),
				json_value: eb.ref("excluded.json_value"),
				page_link_id: eb.ref("excluded.page_link_id"),
				media_id: eb.ref("excluded.media_id"),
				group_id: eb.ref("excluded.group_id"),
			})),
		)
		.returning(["fields_id"])
		.execute();

	// delete fields not in fieldsRes
	await serviceConfig.db
		.deleteFrom("headless_fields")
		.where(
			"collection_brick_id",
			"in",
			fields.map((field) => field.collection_brick_id),
		)
		.where(
			"fields_id",
			"not in",
			fieldsRes.map((field) => field.fields_id),
		)
		.execute();
};

export default upsertMultipleFields;
