import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import type { BrickObjectT, GroupObjectT } from "../../schemas/bricks.js";

export interface GroupObjectWithBrickIdT extends GroupObjectT {
	collection_brick_id: number;
}
export interface GroupObjectNeedsCreatingT extends GroupObjectWithBrickIdT {
	group_id: string;
}

export interface ServiceData {
	bricks: Array<BrickObjectT>;
}

const createMultipleGroups = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const newGroups: {
		group_id: number;
		ref: string;
	}[] = [];
	const refToIdMap: Record<string, number> = {};

	// Asign the collection_brick_id to the groups
	const groups: GroupObjectWithBrickIdT[] = data.bricks.flatMap((brick) => {
		if (typeof brick.id !== "number")
			throw new APIError({
				type: "basic",
				name: T("dynamic_error_name", {
					name: T("group"),
				}),
				message: T("creation_error_message", {
					name: T("group").toLowerCase(),
				}),
				status: 500,
			});

		const groups =
			brick.groups?.map((group) => {
				return {
					...group,
					collection_brick_id: brick.id as number,
				};
			}) || [];
		return groups;
	});

	// Find the groups that need to be created via the ref value
	const needCreating = groups.filter(
		(group) =>
			typeof group.group_id === "string" &&
			group.group_id.startsWith("ref-"),
	) as GroupObjectNeedsCreatingT[];

	// Recursivly insert the groups - required as groups can reference each other - ensures created in correct order
	const recursiveGroupInsert = async (
		groups: GroupObjectNeedsCreatingT[],
		parentId: string | null | undefined = null,
	) => {
		const groupBatch = prepareGroupBatch(groups, parentId);
		if (groupBatch.length === 0) return;

		updateGroupIds(groupBatch, refToIdMap);

		const insertedGroups = await serviceConfig.db
			.insertInto("headless_groups")
			.values(
				groupBatch.map((group) => {
					return {
						parent_group_id: (group.parent_group_id ?? null) as
							| number
							| null,
						collection_brick_id: group.collection_brick_id,
						language_id: group.language_id,
						repeater_key: group.repeater_key,
						group_order: group.group_order,
						ref: group.group_id,
					};
				}),
			)
			.returning(["ref", "group_id"])
			.execute();

		for (const insertedGroup of insertedGroups) {
			refToIdMap[insertedGroup.ref] = insertedGroup.group_id;
		}

		newGroups.push(...insertedGroups);

		// Recursive call to insert children
		for (const insertedGroup of insertedGroups) {
			await recursiveGroupInsert(groups, insertedGroup.ref);
		}
	};

	await recursiveGroupInsert(needCreating);

	return newGroups;
};

const prepareGroupBatch = (
	groups: GroupObjectNeedsCreatingT[],
	parentId: string | null | undefined = null,
) => {
	if (parentId === null || parentId === undefined) {
		return groups.filter(
			(group) =>
				group.parent_group_id === null ||
				group.parent_group_id === undefined,
		);
	}
	return groups.filter((group) => group.parent_group_id === parentId);
};

const updateGroupIds = (
	groupBatch: GroupObjectNeedsCreatingT[],
	refToIdMap: Record<string, number>,
) => {
	for (const group of groupBatch) {
		if (
			group.parent_group_id === null ||
			group.parent_group_id === undefined
		)
			continue;
		if (refToIdMap[group.parent_group_id]) {
			group.parent_group_id = refToIdMap[group.parent_group_id];
		}
	}
};

export default createMultipleGroups;
