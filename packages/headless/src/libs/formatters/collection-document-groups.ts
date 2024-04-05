import type { GroupResT } from "../../types/response.js";

export interface GroupPropT {
	group_id: number;
	parent_group_id: number | null;
	collection_brick_id: number | null;
	language_id: number;
	repeater_key: string;
	group_order: number;
	ref: string | null;
	collection_document_id: number;
}

export default class CollectionDocumentGroupsFormatter {
	formatMultiple = (props: {
		groups: GroupPropT[];
	}) => {
		return props.groups.map((g) =>
			this.formatSingle({
				group: g,
			}),
		);
	};
	formatSingle = (props: {
		group: GroupPropT;
	}): GroupResT => {
		return {
			group_id: props.group.group_id,
			group_order: props.group.group_order,
			repeater_key: props.group.repeater_key,
			parent_group_id: props.group.parent_group_id,
			language_id: props.group.language_id,
		};
	};
	static swagger = {
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
}
