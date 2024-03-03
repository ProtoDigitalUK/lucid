import type { CollectionBuilderT } from "../builders/collection-builder/index.js";
import type { CollectionResT } from "@headless/types/src/collections.js";

const formatCollection = (instance: CollectionBuilderT): CollectionResT => {
	return {
		key: instance.key,
		...instance.config,
	};
};

export default formatCollection;
