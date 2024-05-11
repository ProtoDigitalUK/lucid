import { createStore, produce } from "solid-js/store";
import shortUUID from "short-uuid";
import brickHelpers from "@/utils/brick-helpers";
import type {
	FieldErrors,
	FieldResponse,
	CollectionDocumentResponse,
	CollectionResponse,
	FieldResponseValue,
	FieldResponseMeta,
	CustomField,
	CollectionBrickConfig,
} from "@lucidcms/core/types";

export interface BrickData {
	id: string | number;
	key: string;
	order: number;
	type: "builder" | "fixed" | "collection-fields";
	open: 1 | 0 | null;
	fields: Array<FieldResponse>;
}

type BrickStoreT = {
	bricks: Array<BrickData>;
	fieldsErrors: Array<FieldErrors>;
	// functions
	reset: () => void;
	setBricks: (
		document?: CollectionDocumentResponse,
		collection?: CollectionResponse,
	) => void;
	addBrick: (props: {
		brickConfig: CollectionBrickConfig;
	}) => void;
	removeBrick: (brickIndex: number) => void;
	toggleBrickOpen: (brickIndex: number) => void;

	setFieldValue: (params: {
		brickIndex: number;
		key: string;
		repeaterKey?: string;
		groupId?: number | string;
		value: FieldResponseValue;
		meta?: FieldResponseMeta;
		contentLanguage: number;
	}) => void;
	addField: (params: {
		brickIndex: number;
		fieldConfig: CustomField;
		groupId?: number | string;
		repeaterKey?: string;
		contentLanguage: number;
	}) => FieldResponse;
	addRepeaterGroup: (params: {
		brickIndex: number;
		fieldConfig: CustomField[];
		key: string;
		groupId?: number | string;
		parentRepeaterKey?: string;
		contentLanguage: number;
	}) => void;
	removeRepeaterGroup: (params: {
		brickIndex: number;
		repeaterKey: string;
		groupId: number | string;
	}) => void;
	swapGroupOrder: (_props: {
		brickIndex: number;
		repeaterKey: string;
		groupId: number | string;
		targetGroupId: number | string;
	}) => void;
	toggleGroupOpen: (
		brickIndex: number,
		repeaterKey: string,
		groupId: number | string,
	) => void;
};

const [get, set] = createStore<BrickStoreT>({
	bricks: [],
	fieldsErrors: [],
	reset() {
		set("bricks", []);
		set("fieldsErrors", []);
	},
	// Bricks
	setBricks(document, collection) {
		set(
			"bricks",
			produce((draft) => {
				// Set with data from document respponse
				draft.push({
					id: "collection-sudo-brick",
					key: "collection-sudo-brick",
					order: -1,
					type: "collection-fields",
					open: 0,
					fields: document?.fields || [],
				});

				for (const brick of document?.bricks || []) {
					draft.push(brick);
				}

				// add empty fixed bricks
				for (const brick of collection?.fixedBricks || []) {
					const brickIndex = draft.findIndex(
						(b) => b.key === brick.key && b.type === "fixed",
					);
					if (brickIndex !== -1) continue;

					draft.push({
						id: `ref-${shortUUID.generate()}}`,
						key: brick.key,
						fields: [],
						type: "fixed",
						open: 0,
						order: -1,
					});
				}
			}),
		);
	},
	addBrick(props) {
		set(
			"bricks",
			produce((draft) => {
				const largestOrder = draft?.reduce((prev, current) => {
					return prev.order > current.order ? prev : current;
				});

				draft.push({
					id: `ref-${shortUUID.generate()}`,
					key: props.brickConfig.key,
					order: largestOrder ? largestOrder.order + 1 : 0,
					type: "builder",
					open: 0,
					fields: [],
				});
			}),
		);
	},
	removeBrick(brickIndex) {
		set(
			"bricks",
			produce((draft) => {
				if (draft[brickIndex].type !== "builder") return;
				draft.splice(brickIndex, 1);
			}),
		);
	},
	toggleBrickOpen(brickIndex) {
		set(
			"bricks",
			produce((draft) => {
				draft[brickIndex].open = draft[brickIndex].open === 1 ? 0 : 1;
			}),
		);
	},
	// Fields
	setFieldValue(params) {
		set(
			"bricks",
			produce((draft) => {
				const field = brickHelpers.findFieldRecursive({
					fields: draft[params.brickIndex].fields,
					targetKey: params.key,
					groupId: params.groupId,
					repeaterKey: params.repeaterKey,
				});

				if (!field) return;
				if (!field.translations) field.translations = {};

				field.translations[params.contentLanguage] = params.value;
				field.meta = params.meta || undefined;
			}),
		);
	},
	addField(params) {
		const newField: FieldResponse = {
			key: params.fieldConfig.key,
			type: params.fieldConfig.type,
			translations: {
				[params.contentLanguage]: params.fieldConfig.default,
			},
		};

		brickStore.set(
			"bricks",
			produce((draft) => {
				const brick = draft[params.brickIndex];
				if (!brick) return;

				// Field belongs on the brick level
				if (params.groupId === undefined) {
					brick.fields.push(newField);
					return;
				}

				if (params.repeaterKey === undefined) return;

				const repeaterField = brickHelpers.findFieldRecursive({
					fields: brick.fields,
					targetKey: params.repeaterKey,
					groupId: params.groupId,
				});
				if (!repeaterField) return;
				if (repeaterField.type !== "repeater") return;

				const group = repeaterField.groups?.find(
					(g) => g.id === params.groupId,
				);
				if (!group) return;

				group.fields.push(newField);
			}),
		);
		return newField;
	},
	// Groups
	addRepeaterGroup(params) {
		set(
			"bricks",
			produce((draft) => {
				const field = brickHelpers.findFieldRecursive({
					fields: draft[params.brickIndex].fields,
					targetKey: params.key,
					groupId: params.groupId,
					repeaterKey: params.parentRepeaterKey,
				});

				if (!field) return;
				if (field.type !== "repeater") return;
				if (field.groups === undefined) field.groups = [];

				const groupFields: FieldResponse[] = [];

				for (const field of params.fieldConfig) {
					groupFields.push({
						key: field.key,
						type: field.type,
						translations: {
							[params.contentLanguage]: field.default,
						},
					});
				}

				if (field.groups.length === 0) {
					field.groups = [
						{
							id: `ref-${shortUUID.generate()}`,
							order: 0,
							open: 0,
							fields: groupFields,
						},
					];
					return;
				}

				const largestOrder = field.groups?.reduce((prev, current) => {
					return prev.order > current.order ? prev : current;
				});

				field.groups.push({
					id: `ref-${shortUUID.generate()}`,
					order: largestOrder.order + 1,
					open: 0,
					fields: groupFields,
				});
			}),
		);
	},
	removeRepeaterGroup(params) {
		set(
			"bricks",
			produce((draft) => {
				const field = brickHelpers.findFieldRecursive({
					fields: draft[params.brickIndex].fields,
					targetKey: params.repeaterKey,
				});

				if (!field) return;
				if (field.type !== "repeater") return;
				if (field.groups === undefined) return;

				const groupIndex = field.groups.findIndex(
					(g) => g.id === params.groupId,
				);
				if (groupIndex === -1) return;

				field.groups.splice(groupIndex, 1);
			}),
		);
	},
	swapGroupOrder(params) {
		set(
			"bricks",
			produce((draft) => {
				const field = brickHelpers.findFieldRecursive({
					fields: draft[params.brickIndex].fields,
					targetKey: params.repeaterKey,
				});

				if (!field) return;
				if (field.type !== "repeater") return;
				if (field.groups === undefined) field.groups = [];

				const groupIndex = field.groups.findIndex(
					(group) => group.id === params.groupId,
				);
				const targetGroupIndex = field.groups.findIndex(
					(group) => group.id === params.targetGroupId,
				);

				if (groupIndex === -1 || targetGroupIndex === -1) return;

				const groupOrder = field.groups[groupIndex].order;

				field.groups[groupIndex].order =
					field.groups[targetGroupIndex].order;
				field.groups[targetGroupIndex].order = groupOrder;

				field.groups.sort((a, b) => a.order - b.order);
			}),
		);
	},
	toggleGroupOpen: (brickIndex, repeaterKey, groupId) => {
		set(
			"bricks",
			produce((draft) => {
				const field = brickHelpers.findFieldRecursive({
					fields: draft[brickIndex].fields,
					targetKey: repeaterKey,
				});

				if (!field || !field.groups) return;

				const group = field.groups.find((g) => g.id === groupId);
				if (!group) return;

				group.open = group.open === 1 ? 0 : 1;
			}),
		);
	},
});

const brickStore = {
	get,
	set,
};

export default brickStore;
