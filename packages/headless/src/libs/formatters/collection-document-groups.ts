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
			groupId: props.group.group_id,
			groupOrder: props.group.group_order,
			repeaterKey: props.group.repeater_key,
			parentGroupId: props.group.parent_group_id,
			languageId: props.group.language_id,
		};
	};
	static swagger = {
		type: "object",
		additionalProperties: true,
		properties: {
			groupId: {
				type: "number",
			},
			groupOrder: {
				type: "number",
			},
			parentGroupId: {
				type: "number",
				nullable: true,
			},
			collectionDocumentId: {
				type: "number",
			},
			repeaterKey: {
				type: "string",
			},
			languageId: {
				type: "number",
			},
		},
	};
}
