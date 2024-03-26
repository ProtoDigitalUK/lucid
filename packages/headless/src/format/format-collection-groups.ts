import type { GroupResT } from "@headless/types/src/bricks.js";

export interface GroupQueryDataT {
	group_id: number;
	parent_group_id: number | null;
	collection_brick_id: number | null;
	language_id: number;
	repeater_key: string;
	group_order: number;
	ref: string | null;
	collection_document_id: number;
}

const formatCollectionGroups = (groups: GroupQueryDataT[]): GroupResT[] =>
	groups.map((group) => {
		return {
			group_id: group.group_id,
			group_order: group.group_order,
			repeater_key: group.repeater_key,
			parent_group_id: group.parent_group_id,
			language_id: group.language_id,
		};
	});

export const swaggerGroupRes = {
	type: "object",
	additionalProperties: true,
	properties: {
		group_id: {
			type: "number",
		},
		group_order: {
			type: "number",
		},
		parent_group_id: {
			type: "number",
			nullable: true,
		},
		collection_document_id: {
			type: "number",
		},
		repeater_key: {
			type: "string",
		},
		language_id: {
			type: "number",
		},
	},
};

export default formatCollectionGroups;
