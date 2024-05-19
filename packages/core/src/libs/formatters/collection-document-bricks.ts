import type { BrickResponse, FieldResponse } from "../../types/response.js";
import type CollectionBuilder from "../builders/collection-builder/index.js";
import type BrickBuilder from "../builders/brick-builder/index.js";
import type { BooleanInt } from "../db/types.js";
import CollectionDocumentFieldsFormatter, {
	type FieldProp,
} from "./collection-document-fields.js";

export interface BrickPropT {
	id: number;
	brick_key: string | null;
	brick_order: number | null;
	brick_type: string;
	brick_open: BooleanInt | null;
	collection_document_id: number;
	groups: Array<{
		group_id: number;
		parent_group_id: number | null;
		collection_brick_id: number | null;
		repeater_key: string;
		group_order: number;
		group_open: BooleanInt | null;
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
		defaultLocaleCode?: string;
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
					id: brick.id,
					key: brick.brick_key as string,
					order: brick.brick_order as number,
					type: brick.brick_type as "builder" | "fixed",
					open: brick.brick_open,
					fields: new CollectionDocumentFieldsFormatter().formatMultiple(
						{
							fields: brick.fields,
							groups: brick.groups,
							host: props.host,
							builder: builder,
							defaultLocaleCode: props.defaultLocaleCode,
						},
					),
				};
			});
	};
	formatCollectionSudoBrick = (props: {
		bricks: BrickPropT[];
		collection: CollectionBuilder;
		host: string;
		defaultLocaleCode?: string;
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
					defaultLocaleCode: props.defaultLocaleCode,
				}),
			);
	};
	static swagger = {
		type: "object",
		additionalProperties: true,
		properties: {
			id: {
				type: "number",
			},
			key: {
				type: "string",
			},
			order: {
				type: "number",
			},
			open: {
				type: "number",
				nullable: true,
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
