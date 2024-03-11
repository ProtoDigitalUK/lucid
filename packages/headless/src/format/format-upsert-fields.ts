import type { BrickFieldObjectT, BrickObjectT } from "../schemas/bricks.js";
import type { FieldTypes } from "../builders/brick-builder/index.js";
import type { PageLinkValueT, LinkValueT } from "@headless/types/src/bricks.js";
import collectionBrickServices from "../services/collection-bricks/index.js";

const valueKey = (type: BrickFieldObjectT["type"]) => {
	switch (type) {
		case "text":
			return "text_value";
		case "wysiwyg":
			return "text_value";
		case "media":
			return "media_id";
		case "number":
			return "int_value";
		case "checkbox":
			return "bool_value";
		case "select":
			return "text_value";
		case "textarea":
			return "text_value";
		case "json":
			return "json_value";
		case "pagelink":
			return "page_link_id";
		case "link":
			return "text_value";
		case "datetime":
			return "text_value";
		case "colour":
			return "text_value";
		default:
			return "text_value";
	}
};

const fieldTypeValues = (field: BrickFieldObjectT) => {
	switch (field.type) {
		case "link": {
			const value = field.value as LinkValueT | undefined;
			if (!value) {
				return {
					text_value: null,
					json_value: null,
				};
			}
			return {
				text_value: value.url,
				json_value: {
					target: value.target,
					label: value.label,
				},
			};
		}
		case "pagelink": {
			const value = field.value as PageLinkValueT | undefined;
			if (!value) {
				return {
					page_link_id: null,
					json_value: null,
				};
			}
			return {
				page_link_id: value.id,
				json_value: {
					target: value.target,
					label: value.label,
				},
			};
		}
		default: {
			return {
				[valueKey(field.type)]: field.value,
			};
		}
	}
};

interface BrickFieldUpdateObject {
	fields_id?: number | undefined;
	collection_brick_id: number;
	key: string;
	type: FieldTypes;
	group_id?: number | null;
	text_value: string | null;
	int_value: number | null;
	bool_value: boolean | null;
	json_value: unknown | null;
	page_link_id: number | null;
	media_id: number | null;
	language_id: number;
}

const formatUpsertFields = (
	brick: BrickObjectT,
	groups: Awaited<
		ReturnType<typeof collectionBrickServices.upsertMultipleGroups>
	>,
): Array<BrickFieldUpdateObject> => {
	return (
		brick.fields?.map((field) => {
			const findGroup = groups.find(
				(group) => group.ref === field.group_id,
			);

			return {
				language_id: field.language_id,
				fields_id: field.fields_id,
				collection_brick_id: brick.id as number,
				key: field.key,
				type: field.type,
				group_id: findGroup?.group_id ?? null,

				text_value: null,
				int_value: null,
				bool_value: null,
				json_value: null,
				page_link_id: null,
				media_id: null,
				...fieldTypeValues(field),
			};
		}) || []
	);
};

export default formatUpsertFields;
