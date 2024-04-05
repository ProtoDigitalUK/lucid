import type { CollectionResT } from "../../types/response.js";
import type { CollectionBuilderT } from "../builders/collection-builder/index.js";

export default class CollectionsFormatter {
	formatMultiple = (props: {
		collections: CollectionBuilderT[];
		include?: {
			bricks?: boolean;
			fields?: boolean;
			document_id?: boolean;
		};
		documents?: Array<{
			id?: number;
			collection_key: string;
		}>;
	}) => {
		return props.collections.map((c) =>
			this.formatSingle({
				collection: c,
				include: props.include,
				documents: props.documents,
			}),
		);
	};
	formatSingle = (props: {
		collection: CollectionBuilderT;
		include?: {
			bricks?: boolean;
			fields?: boolean;
			document_id?: boolean;
		};
		documents?: Array<{
			id?: number;
			collection_key: string;
		}>;
	}): CollectionResT => {
		const collectionData = props.collection.data;
		const key = props.collection.key;

		return {
			key: key,
			mode: collectionData.mode,
			title: collectionData.title,
			singular: collectionData.singular,
			description: collectionData.description ?? null,
			document_id: props.include?.document_id
				? this.getDocumentId(key, props.documents)
				: undefined,
			translations: collectionData.config.translations ?? false,

			fixed_bricks: props.include?.bricks
				? props.collection.fixedBricks ?? []
				: [],
			builder_bricks: props.include?.bricks
				? props.collection.builderBricks ?? []
				: [],
			fields: props.include?.fields
				? props.collection.flatFields ?? []
				: [],
		};
	};
	private getDocumentId = (
		collectionKey: string,
		documents?: Array<{
			id?: number;
			collection_key: string;
		}>,
	) => {
		const document = documents?.find(
			(document) => document.collection_key === collectionKey,
		);

		return document?.id ?? undefined;
	};
	static swaggerFieldsConfig = {
		type: "object",
		additionalProperties: true,
		properties: {
			type: {
				type: "string",
			},
			title: {
				type: "string",
			},
			key: {
				type: "string",
			},
			description: {
				type: "string",
			},
			fields: {
				type: "array",
				items: {
					type: "object",
					additionalProperties: true,
				},
			},
		},
	};
	static swaggerBricksConfig = {
		type: "object",
		additionalProperties: true,
		properties: {
			key: {
				type: "string",
			},
			title: {
				type: "string",
			},
			preview: {
				type: "object",
				additionalProperties: true,
				properties: {
					image: {
						type: "string",
					},
				},
			},
			fields: {
				type: "array",
				items: this.swaggerFieldsConfig,
			},
		},
	};
	static swagger = {
		type: "object",
		properties: {
			key: { type: "string", example: "pages" },
			mode: { type: "string", example: "single" },
			title: { type: "string", example: "Pages" },
			singular: { type: "string", example: "Page" },
			description: {
				type: "string",
				example: "A collection of pages",
				nullable: true,
			},
			document_id: { type: "number", example: 1, nullable: true },
			translations: { type: "boolean", example: false },
			fixed_bricks: {
				type: "array",
				items: this.swaggerBricksConfig,
			},
			builder_bricks: {
				type: "array",
				items: this.swaggerBricksConfig,
			},
			fields: {
				type: "array",
				items: this.swaggerFieldsConfig,
			},
		},
	};
}
