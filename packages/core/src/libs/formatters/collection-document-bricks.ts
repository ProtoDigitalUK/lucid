import type {
	BrickResponse,
	FieldResponse,
	GroupResponse,
} from "../../types/response.js";
import type CollectionBuilder from "../builders/collection-builder/index.js";
import type BrickBuilder from "../builders/brick-builder/index.js";
import CollectionDocumentGroupsFormatter, {
	type GroupPropT,
} from "./collection-document-groups.js";
import CollectionDocumentFieldsFormatter, {
	type FieldProp,
} from "./collection-document-fields.js";

interface BrickPropT {
	id: number;
	brick_key: string | null;
	brick_order: number | null;
	brick_type: string;
	collection_document_id: number;
	groups: Array<GroupPropT>;
	fields: Array<FieldProp>;
}

export default class CollectionDocumentBricksFormatter {
	formatMultiple = (props: {
		bricks: BrickPropT[];
		collection: CollectionBuilder;
		host: string;
	}): {
		bricks: BrickResponse[];
		fields: FieldResponse[] | null;
		groups: GroupResponse[] | null;
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
				}) as BrickBuilder;

				return {
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

		const collectionSudoBrickFilter = props.bricks
			.filter((brick) => {
				if (brick.brick_type !== "collection-fields") return false;
				return true;
			})
			.map((brick) => {
				return {
					fields: new CollectionDocumentFieldsFormatter().formatMultiple(
						{
							fields: brick.fields,
							host: props.host,
							builder: props.collection,
						},
					),
					groups: new CollectionDocumentGroupsFormatter().formatMultiple(
						{
							groups: brick.groups,
						},
					),
				};
			});

		const collectionSudoBrick =
			collectionSudoBrickFilter.length && collectionSudoBrickFilter[0]
				? collectionSudoBrickFilter[0]
				: null;

		return {
			bricks,
			fields: collectionSudoBrick?.fields ?? null,
			groups: collectionSudoBrick?.groups ?? null,
		};
	};
	static swagger = {
		type: "object",
		additionalProperties: true,
		properties: {
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
