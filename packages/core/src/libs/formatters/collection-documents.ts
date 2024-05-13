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
		defaultLanguageId?: number;
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
					defaultLanguageId: props.defaultLanguageId,
				},
			);
		}

		const res: CollectionDocumentResponse = {
			id: props.document.id,
			collectionKey: props.document.collection_key,
			bricks: props.bricks ?? null,
			fields: fields,
			createdBy: props.document.created_by,
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
