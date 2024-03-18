import { createStore, produce } from "solid-js/store";
import shortUUID from "short-uuid";
// Utils
import brickHelpers from "@/utils/brick-helpers";
// Types
import type { FieldTypes } from "@headless/types/src/multiple-page";
import type {
	BrickFieldValueT,
	CustomFieldT,
	BrickFieldMetaT,
} from "@headless/types/src/bricks";
import type { CollectionResT } from "@headless/types/src/collections";
import type { FieldError } from "@/types/api";

export interface BrickStoreFieldT {
	fields_id?: number;
	key: string;
	type: FieldTypes;
	value?: BrickFieldValueT;
	meta?: BrickFieldMetaT;
	group_id?: string | number | null;
	language_id: number;
}

export interface BrickStoreGroupT {
	group_id: string | number;
	parent_group_id: null | string | number;
	repeater_key: string;
	group_order: number;
	language_id: number;
}

export interface BrickDataT {
	id: number | string;
	key: string;
	fields: Array<BrickStoreFieldT>;
	groups: Array<BrickStoreGroupT>;
	order: number;
	type: "builder" | "fixed";
	position?: "top" | "bottom" | "sidebar";
}

type BuilderStoreT = {
	bricks: Array<BrickDataT>;
	fieldsErrors: Array<FieldError>;
	// functions
	reset: () => void;
	addBrick: (_props: {
		brick: {
			key: BrickDataT["key"];
			fields: BrickDataT["fields"];
			groups: BrickDataT["groups"];
			order?: BrickDataT["order"];
			type: BrickDataT["type"];
			position?: BrickDataT["position"];
		};
	}) => void;
	removeBrick: (_props: { id: number | string }) => void;
	sortOrder: (_props: { from: number | string; to: number | string }) => void;
	addMissingFixedBricks: (
		_collectionBricks: CollectionResT["bricks"],
	) => void;
	findFieldIndex: (_props: {
		fields: BrickStoreFieldT[];
		key: string;
		groupId?: BrickStoreFieldT["group_id"];
		contentLanguage: number | undefined;
	}) => number;
	addField: (_props: {
		brickIndex: number;
		field: CustomFieldT;
		groupId?: BrickStoreFieldT["group_id"];
		contentLanguage: number | undefined;
	}) => void;
	updateFieldValue: (_props: {
		brickIndex: number;
		key: string;
		value: BrickFieldValueT;
		groupId?: BrickStoreFieldT["group_id"];
		contentLanguage: number | undefined;
		meta?: BrickFieldMetaT;
	}) => void;
	addGroup: (_props: {
		brickIndex: number;
		fields: CustomFieldT[];
		repeaterKey: string;
		parentGroupId: BrickStoreGroupT["parent_group_id"];
		order: number;
		contentLanguage: number | undefined;
	}) => BrickStoreGroupT | undefined;
	removeGroup: (_props: {
		brickIndex: number;
		groupId: BrickStoreGroupT["group_id"];
	}) => void;
	swapGroupOrder: (_props: {
		brickIndex: number;

		groupId: BrickStoreGroupT["group_id"];
		targetGroupId: BrickStoreGroupT["group_id"];
	}) => void;
};

const [get, set] = createStore<BuilderStoreT>({
	bricks: [],
	fieldsErrors: [],

	reset() {
		set("bricks", []);
		set("fieldsErrors", []);
	},

	// --------------------------------------------
	// Bricks
	addBrick({ brick }) {
		set(
			"bricks",
			produce((draft) => {
				const targetOrder =
					brick.order || brickHelpers.getNextBrickOrder(brick.type);

				draft.push({
					id: `temp-${shortUUID.generate()}`, // strip from update
					key: brick.key,
					fields: brick.fields,
					groups: brick.groups,
					order: targetOrder,
					type: brick.type,
					position: brick.position,
				});
			}),
		);
	},
	removeBrick({ id }) {
		set(
			"bricks",
			produce((draft) => {
				const brickIndex = draft.findIndex((brick) => brick.id === id);
				if (brickIndex === -1) return;

				draft.splice(brickIndex, 1);
			}),
		);
	},
	sortOrder({ from, to }) {
		set(
			"bricks",
			produce((draft) => {
				const fromBrick = draft.find((brick) => brick.id === from);
				const toBrick = draft.find((brick) => brick.id === to);

				if (!fromBrick || !toBrick) return;

				const fromOrder = fromBrick.order;
				fromBrick.order = toBrick.order;
				toBrick.order = fromOrder;
			}),
		);
	},
	addMissingFixedBricks(collectionBricks) {
		if (!collectionBricks) return;

		set(
			"bricks",
			produce((draft) => {
				for (const brick of collectionBricks) {
					if (brick.type !== "fixed") continue;

					const brickIndex = draft.findIndex(
						(b) => b.key === brick.key && b.type === "fixed",
					);
					if (brickIndex !== -1) {
						draft[brickIndex].position = brick.position;
						continue;
					}

					const newBrick: BrickDataT = {
						id: `temp-${shortUUID.generate()}}`,
						key: brick.key,
						fields: [],
						groups: [],
						type: "fixed",
						order: -1,
						position: brick.position,
					};

					draft.push(newBrick);
				}
			}),
		);
	},

	// --------------------------------------------
	// Fields
	findFieldIndex(params) {
		const fieldIndex = params.fields.findIndex(
			(f) =>
				f.key === params.key &&
				f.group_id === params.groupId &&
				f.language_id === params.contentLanguage,
		);
		return fieldIndex;
	},
	addField(params) {
		builderStore.set(
			"bricks",
			produce((draft) => {
				const brick = draft[params.brickIndex];
				if (!brick) return;
				if (params.contentLanguage === undefined) return;

				const newField: BrickStoreFieldT = {
					key: params.field.key,
					type: params.field.type,
					value: params.field.default,
					group_id: params.groupId,
					language_id: params.contentLanguage,
				};

				brick.fields.push(newField);
			}),
		);
	},
	updateFieldValue(params) {
		builderStore.set(
			"bricks",
			produce((draft) => {
				const brick = draft[params.brickIndex];
				if (!brick) return;
				if (params.contentLanguage === undefined) return;

				const fieldIndex = get.findFieldIndex({
					fields: brick.fields,
					key: params.key,
					groupId: params.groupId,
					contentLanguage: params.contentLanguage,
				});

				if (fieldIndex !== -1) {
					brick.fields[fieldIndex].value = params.value;
					brick.fields[fieldIndex].meta = params.meta || undefined;
				}
			}),
		);
	},
	// --------------------------------------------
	// Groups
	addGroup(params) {
		let newGroup: BrickStoreGroupT | undefined = undefined;

		builderStore.set(
			"bricks",
			produce((draft) => {
				const brick = draft[params.brickIndex];
				if (!brick) return;
				if (params.contentLanguage === undefined) return;

				const ID = `ref-${shortUUID.generate()}`;
				newGroup = {
					group_id: ID,
					repeater_key: params.repeaterKey,
					parent_group_id: params.parentGroupId,
					group_order: params.order,
					language_id: params.contentLanguage,
				};

				for (const field of params.fields) {
					const newField: BrickStoreFieldT = {
						key: field.key,
						type: field.type,
						value: field.default,
						group_id: ID,
						language_id: params.contentLanguage as number,
					};
					brick.fields.push(newField);
				}

				brick.groups.push(newGroup);
			}),
		);

		return newGroup;
	},
	removeGroup(params) {
		builderStore.set(
			"bricks",
			produce((draft) => {
				const brick = draft[params.brickIndex];
				if (!brick) return;

				const removeGroupIds = [params.groupId];

				const findChildGroups = (
					group_id: BrickStoreGroupT["group_id"],
				) => {
					for (const group of brick.groups) {
						if (group.parent_group_id === group_id) {
							removeGroupIds.push(group.group_id);
							findChildGroups(group.group_id);
						}
					}
				};
				findChildGroups(params.groupId);

				brick.groups = brick.groups.filter(
					(group) => !removeGroupIds.includes(group.group_id),
				);
				brick.fields = brick.fields.filter((field) => {
					if (field.group_id) {
						return !removeGroupIds.includes(field.group_id);
					}
					return true;
				});
			}),
		);
	},
	swapGroupOrder(params) {
		builderStore.set(
			"bricks",
			produce((draft) => {
				const brick = draft[params.brickIndex];
				if (!brick) return;

				const groupIndex = brick.groups.findIndex(
					(group) => group.group_id === params.groupId,
				);
				const targetGroupIndex = brick.groups.findIndex(
					(group) => group.group_id === params.targetGroupId,
				);

				if (groupIndex === -1 || targetGroupIndex === -1) return;

				const groupOrder = brick.groups[groupIndex].group_order;
				brick.groups[groupIndex].group_order =
					brick.groups[targetGroupIndex].group_order;
				brick.groups[targetGroupIndex].group_order = groupOrder;
			}),
		);
	},
});

const builderStore = {
	get,
	set,
};

export default builderStore;
