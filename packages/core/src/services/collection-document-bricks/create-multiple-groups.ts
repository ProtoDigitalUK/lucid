import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";
import type { GroupInsertItem } from "./helpers/flatten-fields.js";

export interface GroupsResponse {
	groupId: number;
	parentGroupId: number | null;
	groupOrder: number;
	repeaterKey: string;
	ref: string;
}

export interface ServiceData {
	documentId: number;
	brickGroups: Array<{
		brickId: number;
		groups: GroupInsertItem[];
	}>;
}

const createMultipleGroups = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const flatGroups = data.brickGroups.flatMap((bg) => bg.groups || []);
	if (flatGroups.length === 0) return [];

	const CollectionDocumentGroupsRepo = Repository.get(
		"collection-document-groups",
		serviceConfig.db,
	);

	// -------------------------------------------------------------------------------
	// create groups
	const groupsRes = await CollectionDocumentGroupsRepo.createMultiple({
		items: data.brickGroups.flatMap((bg) => {
			if (!bg.groups) return [];

			return bg.groups.map((group) => {
				return {
					collectionDocumentId: data.documentId,
					collectionBrickId: bg.brickId,
					groupOrder: group.order,
					repeaterKey: group.repeater,
					ref: group.ref,
				};
			});
		}),
	});

	// -------------------------------------------------------------------------------
	// update groups with their new parent_group_id
	const updateGroupParentIds: {
		parent_group_id: number | null;
		group_id: number;
	}[] = [];
	for (const bg of data.brickGroups) {
		for (const group of bg.groups || []) {
			if (group.parentGroupRef === undefined) continue;

			let targetGroupId = null;
			let parentGroupId = null;

			const findTargetGroup = groupsRes.find(
				(res) => res.ref === group.ref,
			);
			if (findTargetGroup === undefined) continue;

			targetGroupId = findTargetGroup.group_id;

			const findParentGroup = groupsRes.find(
				(res) => res.ref === group.parentGroupRef,
			);
			if (findParentGroup === undefined) continue;

			parentGroupId = findParentGroup.group_id;

			updateGroupParentIds.push({
				parent_group_id: parentGroupId,
				group_id: targetGroupId,
			});
		}
	}

	if (updateGroupParentIds.length > 0) {
		// TODO: look into bug here stopping from update
		await CollectionDocumentGroupsRepo.updateMultipleParentIds({
			items: updateGroupParentIds,
		});
	}

	return groupsRes;
};

export default createMultipleGroups;
