import type { BrickResT, FieldResT } from "@headless/types/src/bricks.js";
import type { CollectionBuilderT } from "../libs/collection-builder/index.js";
import type { BrickBuilderT } from "../libs/brick-builder/index.js";
import formatCollectionFields, {
	type FieldQueryDataT,
	swaggerFieldRes,
} from "./format-collection-fields.js";
import formatCollectionGroups, {
	type GroupQueryDataT,
	swaggerGroupRes,
} from "./format-collection-groups.js";

export interface BrickQueryDataT {
	id: number;
	brick_key: string | null;
	brick_order: number | null;
	brick_type: string;
	collection_document_id: number;
	groups: Array<GroupQueryDataT>;
	fields: Array<FieldQueryDataT>;
}

interface FormatBricksT {
	bricks: BrickQueryDataT[];
	collection: CollectionBuilderT;
	host: string;
}

const formatCollectionBricks = (
	props: FormatBricksT,
): {
	bricks: BrickResT[];
	fields: FieldResT[] | null;
} => {
	const brickBuilders = [
		...(props.collection.config.bricks?.builder || []),
		...(props.collection.config.bricks?.fixed || []),
	];

	const bricks = props.bricks
		.filter((brick) => {
			if (brick.brick_type === "collection-fields") return false;
			const builder = brickBuilders.find((b) => {
				return b.key === brick.brick_key;
			});
			if (!builder) return false;

			return true;
		})
		.map((brick) => {
			const builder = brickBuilders.find((b) => {
				return b.key === brick.brick_key;
			}) as BrickBuilderT;

			return {
				id: brick.id,
				key: brick.brick_key as string,
				order: brick.brick_order as number,
				type: brick.brick_type as "builder" | "fixed",
				groups: formatCollectionGroups(brick.groups),
				fields: formatCollectionFields({
					fields: brick.fields,
					host: props.host,
					collection_slug: props.collection.data.slug,
					builder: builder,
				}),
			};
		});

	const collectionFields = props.bricks
		.filter((brick) => {
			if (brick.brick_type !== "collection-fields") return false;
			return true;
		})
		.map((brick) =>
			formatCollectionFields({
				fields: brick.fields,
				host: props.host,
				collection_slug: props.collection.data.slug,
				builder: props.collection,
			}),
		);

	return {
		bricks,
		fields: collectionFields.length ? collectionFields[0] : null,
	};
};

export const swaggerBrickRes = {
	type: "object",
	additionalProperties: true,
	properties: {
		id: {
			type: "number",
		},
		collection_document_id: {
			type: "number",
		},
		key: {
			type: "string",
		},
		order: {
			type: "number",
		},
		type: {
			type: "string",
			enum: ["builder", "fixed"],
		},
		groups: {
			type: "array",
			items: swaggerGroupRes,
		},
		fields: {
			type: "array",
			items: swaggerFieldRes,
		},
	},
};

export default formatCollectionBricks;
