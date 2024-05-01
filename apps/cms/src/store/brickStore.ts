import { createStore, produce } from "solid-js/store";
import type {
	FieldErrors,
	FieldResponse,
	BrickResponse,
} from "@protoheadless/core/types";

type BrickStoreT = {
	bricks: Array<BrickResponse>;
	collectionFields: Array<FieldResponse>;
	fieldsErrors: Array<FieldErrors>;
	// functions
	reset: () => void;
};

const [get, set] = createStore<BrickStoreT>({
	bricks: [],
	collectionFields: [],
	fieldsErrors: [],

	reset() {
		set("bricks", []);
		set("collectionFields", []);
		set("fieldsErrors", []);
	},
});

const brickStore = {
	get,
	set,
};

export default brickStore;
