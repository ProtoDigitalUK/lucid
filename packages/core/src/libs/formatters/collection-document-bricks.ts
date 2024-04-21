import type { BrickResponse, FieldResponse } from "../../types/response.js";
import type CollectionBuilder from "../builders/collection-builder/index.js";
import type BrickBuilder from "../builders/brick-builder/index.js";
import CollectionDocumentFieldsFormatter, {
	type FieldProp,
} from "./collection-document-fields.js";

export interface BrickPropT {
	id: number;
	brick_key: string | null;
	brick_order: number | null;
	brick_type: string;
	collection_document_id: number;
	groups: Array<{
		group_id: number;
		parent_group_id: number | null;
		collection_brick_id: number | null;
		repeater_key: string;
		group_order: number;
		ref: string | null;
		collection_document_id: number;
	}>;
	fields: Array<FieldProp>;
}

export default class CollectionDocumentBricksFormatter {
	formatMultiple = (props: {
		bricks: BrickPropT[];
		collection: CollectionBuilder;
		host: string;
	}): BrickResponse[] => {
		return props.bricks
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
				}) as BrickBuilder;

				return {
					key: brick.brick_key as string,
					order: brick.brick_order as number,
					type: brick.brick_type as "builder" | "fixed",
					fields: new CollectionDocumentFieldsFormatter().formatMultiple(
						{
							fields: brick.fields,
							groups: brick.groups,
							host: props.host,
							builder: builder,
						},
					),
				};
			});
	};
	formatCollectionSudoBrick = (props: {
		bricks: BrickPropT[];
		collection: CollectionBuilder;
		host: string;
	}): FieldResponse[] => {
		return props.bricks
			.filter((brick) => {
				if (brick.brick_type !== "collection-fields") return false;
				return true;
			})
			.flatMap((brick) =>
				new CollectionDocumentFieldsFormatter().formatMultiple({
					fields: brick.fields,
					groups: brick.groups,
					host: props.host,
					builder: props.collection,
				}),
			);
	};
	static swagger = {
		type: "object",
		additionalProperties: true,
		properties: {
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
			fields: {
				type: "array",
				items: CollectionDocumentFieldsFormatter.swagger,
			},
		},
	};
}
