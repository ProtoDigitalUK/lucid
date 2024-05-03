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
	FieldGroupResponse,
} from "@protoheadless/core/types";

export interface BrickData {
	id: string | number;
	key: string;
	order: number;
	type: "builder" | "fixed" | "collection-fields";
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
	setFieldValue: (props: {
		brickIndex: number;
		fieldPath: string[];
		groupPath: Array<number | string>;
		value: FieldResponseValue;
		meta?: FieldResponseMeta;
	}) => void;
	addRepeaterGroup: (props: {
		brickIndex: number;
		fieldPath: string[];
		groupPath: Array<number | string>;
		fields: CustomField[];
		contentLanguage?: number;
	}) => void;
	removeRepeaterGroup: (props: {
		brickIndex: number;
		fieldPath: string[];
		groupPath: Array<number | string>;
		groupId: number | string;
	}) => void;
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
						order: -1,
					});
				}
			}),
		);

		// set empty brick data if collection fields (sudo brick) is empty
	},
	// Fields
	setFieldValue(params) {
		set(
			"bricks",
			produce((draft) => {
				const field = brickHelpers.getBrickFieldRecursive({
					fields: draft[params.brickIndex].fields,
					fieldPath: params.fieldPath,
					groupPath: params.groupPath,
				});

				if (!field) return;

				field.value = params.value;
				field.meta = params.meta || undefined;
			}),
		);
	},
	// Groups
	addRepeaterGroup(params) {
		set(
			"bricks",
			produce((draft) => {
				const field = brickHelpers.getBrickFieldRecursive({
					fields: draft[params.brickIndex].fields,
					fieldPath: params.fieldPath,
					groupPath: params.groupPath,
				});

				if (!field) return;
				if (field.type !== "repeater") return;
				if (field.groups === undefined) field.groups = [];

				const groupFields: FieldResponse[] = [];

				for (const field of params.fields) {
					groupFields.push({
						key: field.key,
						type: field.type,
						value: field.default,
						languageId: params.contentLanguage,
					});
				}

				field.groups.push({
					id: `ref-${shortUUID.generate()}`,
					fields: groupFields,
				});
			}),
		);
	},
	removeRepeaterGroup(params) {
		set(
			"bricks",
			produce((draft) => {
				const field = brickHelpers.getBrickFieldRecursive({
					fields: draft[params.brickIndex].fields,
					fieldPath: params.fieldPath,
					groupPath: params.groupPath,
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
});

const brickStore = {
	get,
	set,
};

export default brickStore;
