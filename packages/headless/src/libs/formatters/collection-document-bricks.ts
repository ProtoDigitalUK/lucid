import type { BrickResT, FieldResT } from "../../types/response.js";
import type { CollectionBuilderT } from "../builders/collection-builder/index.js";
import type { BrickBuilderT } from "../builders/brick-builder/index.js";
import CollectionDocumentGroupsFormatter, {
	type GroupPropT,
} from "./collection-document-groups.js";
import CollectionDocumentFieldsFormatter, {
	type FieldPropT,
} from "./collection-document-fields.js";

interface BrickPropT {
	id: number;
	brick_key: string | null;
	brick_order: number | null;
	brick_type: string;
	collection_document_id: number;
	groups: Array<GroupPropT>;
	fields: Array<FieldPropT>;
}

export default class CollectionDocumentBricksFormatter {
	formatMultiple = (props: {
		bricks: BrickPropT[];
		collection: CollectionBuilderT;
		host: string;
	}): {
		bricks: BrickResT[];
		fields: FieldResT[] | null;
	} => {
		const bricks = props.bricks
			.filter((brick) => {
				if (brick.brick_type === "collection-fields") return false;
				const builder = props.collection.brickInstances.find((b) => {
					return b.key === brick.brick_key;
				});
				if (!builder) return false;

				return true;
			})
			.map((brick) => {
				const builder = props.collection.brickInstances.find((b) => {
					return b.key === brick.brick_key;
				}) as BrickBuilderT;

				return {
					id: brick.id,
					key: brick.brick_key as string,
					order: brick.brick_order as number,
					type: brick.brick_type as "builder" | "fixed",
					groups: new CollectionDocumentGroupsFormatter().formatMultiple(
						{
							groups: brick.groups,
						},
					),
					fields: new CollectionDocumentFieldsFormatter().formatMultiple(
						{
							fields: brick.fields,
							host: props.host,
							builder: builder,
						},
					),
				};
			});

		const collectionFields = props.bricks
			.filter((brick) => {
				if (brick.brick_type !== "collection-fields") return false;
				return true;
			})
			.map((brick) =>
				new CollectionDocumentFieldsFormatter().formatMultiple({
					fields: brick.fields,
					host: props.host,
					builder: props.collection,
				}),
			);

		return {
			bricks,
			fields:
				collectionFields.length && collectionFields[0]
					? collectionFields[0]
					: null,
		};
	};
	static swagger = {
		type: "object",
		additionalProperties: true,
		properties: {
			id: {
				type: "number",
			},
			collectionDocumentId: {
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
				items: CollectionDocumentGroupsFormatter.swagger,
			},
			fields: {
				type: "array",
				items: CollectionDocumentFieldsFormatter.swagger,
			},
		},
	};
}
