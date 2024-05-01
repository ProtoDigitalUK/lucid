import { createStore, produce } from "solid-js/store";
import type {
	FieldErrors,
	FieldResponse,
	CollectionBrickConfigT,
	CustomField,
	CollectionDocumentResponse,
	CollectionResponse,
} from "@protoheadless/core/types";

export interface BrickData {
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
};

const [get, set] = createStore<BrickStoreT>({
	bricks: [],
	fieldsErrors: [],

	reset() {
		set("bricks", []);
		set("fieldsErrors", []);
	},
	setBricks(document, collection) {
		set(
			"bricks",
			produce((draft) => {
				// Set with data from document respponse
				draft.push({
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
});

const brickStore = {
	get,
	set,
};

export default brickStore;
