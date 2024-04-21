import T from "../../translations/index.js";
import { HeadlessAPIError } from "../../utils/error-handler.js";
import type { BrickSchema } from "../../schemas/collection-bricks.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface GroupsResponse {
	groupId: number;
	parentGroupId: number | null;
	groupOrder: number;
	repeaterKey: string;
	ref: string;
}

export interface ServiceData {
	documentId: number;
	bricks: Array<BrickSchema>;
}

// TODO: take a look at this function and how it mutates bricks

const createMultipleGroups = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const brickGroups = data.bricks.flatMap((brick) => brick.groups || []);
	if (brickGroups.length === 0) return [];

	const CollectionDocumentGroupsRepo = Repository.get(
		"collection-document-groups",
		serviceConfig.db,
	);

	// Update groups, on id conflict, update group_order, parent_group_id
	const groupsRes = await CollectionDocumentGroupsRepo.createMultiple({
		items: data.bricks.flatMap((brick) => {
			if (!brick.groups) return [];

			return brick.groups.map((group) => {
				return {
					groupId:
						typeof group.groupId === "string"
							? undefined
							: group.groupId,
					parentGroupId:
						typeof group.parentGroupId === "string"
							? undefined
							: group.parentGroupId,
					collectionDocumentId: data.documentId,
					collectionBrickId: brick.id as number,
					groupOrder: group.groupOrder,
					repeaterKey: group.repeaterKey,
					ref:
						typeof group.groupId === "string"
							? group.groupId
							: undefined,
				};
			});
		}),
	});

	// update groups with their new parent_group_id
	const updateGroupParentIds: {
		parent_group_id: number | null;
		group_id: number;
	}[] = [];

	for (const brick of data.bricks) {
		for (const group of brick.groups || []) {
			let groupId = null;
			let parentGroupId = null;

			if (
				typeof group.groupId === "string" &&
				group.groupId.startsWith("ref-")
			) {
				const foundGroup = groupsRes.find(
					(res) => res.ref === group.groupId,
				);
				if (!foundGroup) continue;
				groupId = foundGroup.group_id;
			}

			if (
				typeof group.parentGroupId === "string" &&
				group.parentGroupId.startsWith("ref-")
			) {
				const parentGroup = groupsRes.find(
					(res) => res.ref === group.parentGroupId,
				);
				if (!parentGroup) continue;
				parentGroupId = parentGroup.group_id;
			}

			if (groupId !== null && parentGroupId !== null) {
				updateGroupParentIds.push({
					parent_group_id: parentGroupId,
					group_id: groupId,
				});
			}
		}
	}

	// Create groups array from bricks and update groups by the group_id with their new parent_group_id
	const groups: GroupsResponse[] = data.bricks.flatMap((brick) => {
		if (!brick.groups) return [];

		return brick.groups.map((group) => {
			let ref = null;

			// set group_id and ref
			if (
				typeof group.groupId === "string" &&
				group.groupId.startsWith("ref-")
			) {
				const foundGroup = groupsRes.find(
					(res) => res.ref === group.groupId,
				);
				if (!foundGroup) {
					throw new HeadlessAPIError({
						type: "basic",
						name: T("error_saving_group"),
						message: T("there_was_an_error_updating_group"),
						status: 400,
					});
				}

				group.groupId = foundGroup.group_id;
				ref = foundGroup.ref;
			}

			// set parent_group_id
			if (
				typeof group.parentGroupId === "string" &&
				group.parentGroupId.startsWith("ref-")
			) {
				const parentGroup = groupsRes.find(
					(res) => res.ref === group.parentGroupId,
				);
				if (parentGroup !== undefined)
					group.parentGroupId = parentGroup.group_id;
				group.parentGroupId = null;
			}

			return {
				groupId: group.groupId as number,
				parentGroupId: group.parentGroupId as number | null,
				groupOrder: group.groupOrder,
				repeaterKey: group.repeaterKey,
				ref: ref as string,
			};
		});
	});

	if (updateGroupParentIds.length > 0) {
		await CollectionDocumentGroupsRepo.updateMultipleParentIds({
			items: updateGroupParentIds,
		});
	}

	return groups;
};

export default createMultipleGroups;
