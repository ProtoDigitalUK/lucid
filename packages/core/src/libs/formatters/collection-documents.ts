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
	updated_by: number | null;
	created_at: Date | string | null;
	updated_at: Date | string | null;
	// Created by user join
	cb_user_id?: number | null;
	cb_user_email?: string | null;
	cb_user_first_name?: string | null;
	cb_user_last_name?: string | null;
	cb_user_username?: string | null;
	// Updated by user join
	ub_user_id?: number | null;
	ub_user_email?: string | null;
	ub_user_first_name?: string | null;
	ub_user_last_name?: string | null;
	ub_user_username?: string | null;

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
		defaultLocaleCode?: string;
	}): CollectionDocumentResponse => {
		let fields: FieldResponse[] | null = null;

		if (props.fields) {
			fields = props.fields;
		} else if (props.document.fields) {
			// ** This is only used on get multiple documents, in this case we dont request groups and so should
			// ** return fields in a flat format instead of nesting them if repeaters are present
			fields = new CollectionDocumentFieldsFormatter().formatMultipleFlat(
				{
					fields: props.document.fields,
					host: props.host,
					builder: props.collection,
					defaultLocaleCode: props.defaultLocaleCode,
				},
			);
		}

		const res: CollectionDocumentResponse = {
			id: props.document.id,
			collectionKey: props.document.collection_key,
			bricks: props.bricks ?? null,
			fields: fields,
			createdBy: props.document.cb_user_id
				? {
						id: props.document.cb_user_id,
						email: props.document.cb_user_email ?? null,
						firstName: props.document.cb_user_first_name ?? null,
						lastName: props.document.cb_user_last_name ?? null,
						username: props.document.cb_user_username ?? null,
					}
				: null,
			updatedBy: props.document.ub_user_id
				? {
						id: props.document.ub_user_id,
						email: props.document.ub_user_email ?? null,
						firstName: props.document.ub_user_first_name ?? null,
						lastName: props.document.ub_user_last_name ?? null,
						username: props.document.ub_user_username ?? null,
					}
				: null,
			createdAt: Formatter.formatDate(props.document.created_at),
			updatedAt: Formatter.formatDate(props.document.updated_at),
		};

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
			bricks: {
				type: "array",
				items: CollectionDocumentBricksFormatter.swagger,
				nullable: true,
			},
			fields: {
				type: "array",
				nullable: true,
				items: CollectionDocumentFieldsFormatter.swagger,
			},
			createdBy: {
				type: "object",
				nullable: true,
				properties: {
					id: {
						type: "number",
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
			},
			createdAt: {
				type: "string",
				nullable: true,
			},
			updatedAt: {
				type: "string",
				nullable: true,
			},
			updatedBy: {
				type: "object",
				nullable: true,
				properties: {
					id: {
						type: "number",
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
			},
		},
	};
}
