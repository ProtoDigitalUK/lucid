import type {
	BrickResponse,
	FieldResponse,
	CollectionDocumentResponse,
} from "../../types/response.js";
import CollectionDocumentFieldsFormatter, {
	type FieldProp,
} from "./collection-document-fields.js";
import type CollectionBuilder from "../builders/collection-builder/index.js";
import Formatter from "./index.js";
import CollectionDocumentBricksFormatter from "./collection-document-bricks.js";

interface DocumentPropT {
	id: number;
	collection_key: string | null;
	created_by: number | null;
	created_at: Date | string | null;
	updated_at: Date | string | null;
	author_id: number | null;
	author_email: string | null;
	author_first_name: string | null;
	author_last_name: string | null;
	author_username: string | null;
	fields?: FieldProp[];
}

export default class CollectionDocumentsFormatter {
	formatMultiple = (props: {
		documents: DocumentPropT[];
		collection: CollectionBuilder;
		host: string;
	}) => {
		return props.documents.map((d) =>
			this.formatSingle({
				document: d,
				collection: props.collection,
				host: props.host,
			}),
		);
	};
	formatSingle = (props: {
		document: DocumentPropT;
		collection: CollectionBuilder;
		bricks?: BrickResponse[];
		fields?: FieldResponse[] | null;
		host: string;
	}): CollectionDocumentResponse => {
		let fields: FieldResponse[] | null = null;
		if (props.fields) {
			fields = props.fields;
		} else if (props.document.fields) {
			fields = new CollectionDocumentFieldsFormatter().formatMultiple({
				fields: props.document.fields,
				host: props.host,
				builder: props.collection,
			});
		}

		const res: CollectionDocumentResponse = {
			id: props.document.id,
			collectionKey: props.document.collection_key,
			bricks: props.bricks || [],
			fields: fields,
			createdBy: props.document.created_by,
			createdAt: Formatter.formatDate(props.document.created_at),
			updatedAt: Formatter.formatDate(props.document.updated_at),
			author: null,
		};

		if (props.document.author_id) {
			res.author = {
				id: props.document.author_id,
				email: props.document.author_email,
				firstName: props.document.author_first_name,
				lastName: props.document.author_last_name,
				username: props.document.author_username,
			};
		}

		return res;
	};
	static swagger = {
		type: "object",
		properties: {
			id: {
				type: "number",
			},
			collectionKey: {
				type: "string",
				nullable: true,
			},
			author: {
				type: "object",
				properties: {
					id: {
						type: "number",
						nullable: true,
					},
					email: {
						type: "string",
						nullable: true,
					},
					firstName: {
						type: "string",
						nullable: true,
					},
					lastName: {
						type: "string",
						nullable: true,
					},
					username: {
						type: "string",
						nullable: true,
					},
				},
				nullable: true,
			},
			bricks: {
				type: "array",
				items: CollectionDocumentBricksFormatter.swagger,
			},
			fields: {
				type: "array",
				nullable: true,
				items: CollectionDocumentFieldsFormatter.swagger,
			},
			createdBy: {
				type: "number",
				nullable: true,
			},
			createdAt: {
				type: "string",
				nullable: true,
			},
			updatedAt: {
				type: "string",
				nullable: true,
			},
		},
	};
}
