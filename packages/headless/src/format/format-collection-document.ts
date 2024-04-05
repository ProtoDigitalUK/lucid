import type { CollectionDocumentResT } from "@headless/types/src/collection-document.js";
import type { BrickResT, FieldResT } from "@headless/types/src/bricks.js";
import type { CollectionBuilderT } from "../libs/builders/collection-builder/index.js";
import { swaggerBrickRes } from "./format-collection-bricks.js";
import formatCollectionFields, {
	type FieldQueryDataT,
	swaggerFieldRes,
} from "./format-collection-fields.js";
import Formatter from "../libs/formatters/index.js";

interface DocumentQueryDataT {
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
	fields?: FieldQueryDataT[];
}

interface FormatCollectionDocumentT {
	document: DocumentQueryDataT;
	collection: CollectionBuilderT;
	bricks?: BrickResT[];
	fields?: FieldResT[] | null;
	host: string;
}

const formatCollectionDocument = (
	props: FormatCollectionDocumentT,
): CollectionDocumentResT => {
	let fields: FieldResT[] | null = null;
	if (props.fields) {
		fields = props.fields;
	} else if (props.document.fields) {
		fields = formatCollectionFields({
			fields: props.document.fields,
			host: props.host,
			builder: props.collection,
		});
	}

	const res: CollectionDocumentResT = {
		id: props.document.id,
		collection_key: props.document.collection_key,
		bricks: props.bricks || [],
		fields: fields,
		created_by: props.document.created_by,
		created_at: Formatter.formatDate(props.document.created_at),
		updated_at: Formatter.formatDate(props.document.updated_at),
		author: null,
	};

	if (props.document.author_id) {
		res.author = {
			id: props.document.author_id,
			email: props.document.author_email,
			first_name: props.document.author_first_name,
			last_name: props.document.author_last_name,
			username: props.document.author_username,
		};
	}

	return res;
};

export const swaggerCollectionDocumentResT = {
	type: "object",
	properties: {
		id: {
			type: "number",
		},
		collection_key: {
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
				first_name: {
					type: "string",
					nullable: true,
				},
				last_name: {
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
			items: swaggerBrickRes,
		},
		fields: {
			type: "array",
			nullable: true,
			items: swaggerFieldRes,
		},
		created_by: {
			type: "number",
			nullable: true,
		},
		created_at: {
			type: "string",
			nullable: true,
		},
		updated_at: {
			type: "string",
			nullable: true,
		},
	},
};

export default formatCollectionDocument;
