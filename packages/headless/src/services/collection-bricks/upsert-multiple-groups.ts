import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import type { BrickObjectT } from "../../schemas/bricks.js";
import { values } from "../../utils/app/kysely-helpers.js";

export interface ServiceData {
	bricks: Array<BrickObjectT>;
}

const upsertMultipleGroups = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	// Update groups, on id conflict, update group_order, parent_group_id
	const groupsRes = await serviceConfig.db
		.insertInto("headless_groups")
		.values(
			data.bricks.flatMap((brick) => {
				if (!brick.groups) return [];

				return brick.groups.map((group) => {
					return {
						group_id:
							typeof group.group_id === "string"
								? undefined
								: group.group_id,
						parent_group_id:
							typeof group.parent_group_id === "string"
								? undefined
								: group.parent_group_id,
						collection_brick_id: brick.id as number,
						group_order: group.group_order,
						repeater_key: group.repeater_key,
						language_id: group.language_id,
						ref:
							typeof group.group_id === "string"
								? group.group_id
								: undefined,
					};
				});
			}),
		)
		.onConflict((oc) =>
			oc.column("group_id").doUpdateSet((eb) => ({
				group_order: eb.ref("excluded.group_order"),
				parent_group_id: eb.ref("excluded.parent_group_id"),
			})),
		)
		.returning(["group_id", "ref"])
		.execute();

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
					parent_group_id: group.parent_group_id as number | null,
					group_id: group.group_id as number,
				});
			}
		}
	}

	if (updateGroupParentIds.length > 0) {
		await serviceConfig.db
			.updateTable("headless_groups")
			.from(values(updateGroupParentIds, "c"))
			.set((eb) => ({
				parent_group_id: eb.ref("c.parent_group_id"),
			}))
			.whereRef("c.group_id", "=", "c.group_id")
			.execute();
	}

	// Create groups array from bricks and update groups by the group_id with their new parent_group_id
	return data.bricks.flatMap((brick) => {
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
				if (!foundGroup) throw new Error("Group not found"); // TODO: update to APIError

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
};

export default upsertMultipleGroups;
