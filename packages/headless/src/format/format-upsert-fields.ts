import type { BrickSchemaT } from "../schemas/collection-bricks.js";
import type { FieldTypesT } from "../libs/field-builder/index.js";
import type { GroupsResT } from "../services/collection-document-bricks/upsert-multiple-groups.js";
import { fieldColumnValueMap } from "../utils/field-helpers.js";

interface FieldUpsertObjectResT {
	fields_id?: number | undefined;
	collection_brick_id: number;
	key: string;
	type: FieldTypesT;
	group_id?: number | null;
	text_value: string | null;
	int_value: number | null;
	bool_value: boolean | null;
	json_value: unknown | null;
	page_link_id: number | null;
	media_id: number | null;
	language_id: number;
}

interface FormatUpsertFieldsT {
	brick: BrickSchemaT;
	groups: Array<GroupsResT>;
}

const formatUpsertFields = (
	props: FormatUpsertFieldsT,
): Array<FieldUpsertObjectResT> => {
	return (
		props.brick.fields?.map((field) => {
			let groupId = null;
			const findGroup = props.groups.find(
				(group) => group.ref === field.group_id,
			);
			if (findGroup === undefined) {
				const findGroupBrick = props.groups.find(
					(group) => group.group_id === field.group_id,
				);
				groupId = findGroupBrick?.group_id ?? null;
			} else groupId = findGroup.group_id;

			return {
				language_id: field.language_id,
				fields_id: field.fields_id,
				collection_brick_id: props.brick.id as number,
				key: field.key,
				type: field.type,
				group_id: groupId,
				text_value: null,
				int_value: null,
				bool_value: null,
				json_value: null,
				page_link_id: null,
				media_id: null,
				...fieldColumnValueMap(field),
			};
		}) || []
	);
};

export default formatUpsertFields;
