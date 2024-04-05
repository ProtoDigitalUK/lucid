import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import type { BrickSchemaT } from "../../schemas/collection-bricks.js";
import Repository from "../../libs/repositories/index.js";

export interface GroupsResT {
	group_id: number;
	parent_group_id: number | null;
	group_order: number;
	repeater_key: string;
	language_id: number;
	ref: string;
}

export interface ServiceData {
	document_id: number;
	bricks: Array<BrickSchemaT>;
}

const upsertMultipleGroups = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const brickGroups = data.bricks.flatMap((brick) => brick.groups || []);
	if (brickGroups.length === 0) return { groups: [], promises: [] };

	const CollectionDocumentGroupsRepo = Repository.get(
		"collection-document-groups",
		serviceConfig.db,
	);

	// Update groups, on id conflict, update group_order, parent_group_id
	const groupsRes = await CollectionDocumentGroupsRepo.upsertMultiple({
		items: data.bricks.flatMap((brick) => {
			if (!brick.groups) return [];

			return brick.groups.map((group) => {
				return {
					groupId:
						typeof group.group_id === "string"
							? undefined
							: group.group_id,
					parentGroupId:
						typeof group.parent_group_id === "string"
							? undefined
							: group.parent_group_id,
					collectionDocumentId: data.document_id,
					collectionBrickId: brick.id as number,
					groupOrder: group.group_order,
					repeaterKey: group.repeater_key,
					languageId: group.language_id,
					ref:
						typeof group.group_id === "string"
							? group.group_id
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
				typeof group.group_id === "string" &&
				group.group_id.startsWith("ref-")
			) {
				const foundGroup = groupsRes.find(
					(res) => res.ref === group.group_id,
				);
				if (!foundGroup) continue;
				groupId = foundGroup.group_id;
			}

			if (
				typeof group.parent_group_id === "string" &&
				group.parent_group_id.startsWith("ref-")
			) {
				const parentGroup = groupsRes.find(
					(res) => res.ref === group.parent_group_id,
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
	const groups = data.bricks.flatMap((brick) => {
		if (!brick.groups) return [];

		return brick.groups.map((group) => {
			let ref = null;

			// set group_id and ref
			if (
				typeof group.group_id === "string" &&
				group.group_id.startsWith("ref-")
			) {
				const foundGroup = groupsRes.find(
					(res) => res.ref === group.group_id,
				);
				if (!foundGroup) {
					throw new APIError({
						type: "basic",
						name: T("error_saving_group"),
						message: T("there_was_an_error_updating_group"),
						status: 400,
					});
				}

				group.group_id = foundGroup.group_id;
				ref = foundGroup.ref;
			}

			// set parent_group_id
			if (
				typeof group.parent_group_id === "string" &&
				group.parent_group_id.startsWith("ref-")
			) {
				const parentGroup = groupsRes.find(
					(res) => res.ref === group.parent_group_id,
				);
				if (parentGroup !== undefined)
					group.parent_group_id = parentGroup.group_id;
				group.parent_group_id = null;
			}

			return {
				group_id: group.group_id as number,
				parent_group_id: group.parent_group_id as number | null,
				group_order: group.group_order,
				repeater_key: group.repeater_key,
				language_id: group.language_id,
				ref: ref as string,
			};
		});
	});

	return {
		groups,
		promises: [
			// Delete groups not in groupsRes
			CollectionDocumentGroupsRepo.deleteMultiple({
				where: [
					{
						key: "collection_brick_id",
						operator: "in",
						value: data.bricks.map((b) => b.id),
					},
					{
						key: "group_id",
						operator: "not in",
						value: groups.map((g) => g.group_id),
					},
				],
			}),
			// Update groups with their new parent_group_id
			updateGroupParentIds.length > 0
				? CollectionDocumentGroupsRepo.updateMultipleParentIds({
						items: updateGroupParentIds,
				  })
				: undefined,
		],
	};
};

export default upsertMultipleGroups;
