import T from "../../../translations/index.js";
import z from "zod";
import CustomField from "../custom-field.js";
import keyToTitle from "../utils/key-to-title.js";
import zodSafeParse from "../utils/zod-safe-parse.js";
import type {
	CFConfig,
	CFProps,
	CFResponse,
	CFInsertItem,
	DocumentReferenceData,
} from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";
import type { FieldInsertItem } from "../../../services/collection-document-bricks/helpers/flatten-fields.js";

class DocumentCustomField extends CustomField<"document"> {
	type = "document" as const;
	column = "document_id" as const;
	config;
	key;
	props;
	constructor(key: string, props: CFProps<"document">) {
		super();
		this.key = key;
		this.props = props;
		this.config = {
			key: this.key,
			type: this.type,
			collection: this.props.collection,
			labels: {
				title: this.props?.labels?.title ?? keyToTitle(this.key),
				description: this.props?.labels?.description,
			},
			translations: this.props?.translations ?? false,
			hidden: this.props?.hidden,
			disabled: this.props?.disabled,
			validation: this.props?.validation,
		} satisfies CFConfig<"document">;
	}
	// Methods
	responseValueFormat(props: {
		data: FieldProp;
		host: string;
	}) {
		console.log(props.data.document_fields);
		console.log(props.data.document_groups);
		// TODO: build out nested fields in meta

		return {
			value: props.data?.document_id ?? null,
			meta: null,
		} satisfies CFResponse<"document">;
	}
	getInsertField(props: {
		item: FieldInsertItem;
		brickId: number;
		groupId: number | null;
	}) {
		return {
			key: this.config.key,
			type: this.config.type,
			localeCode: props.item.localeCode,
			collectionBrickId: props.brickId,
			groupId: props.groupId,
			textValue: null,
			intValue: null,
			boolValue: null,
			jsonValue: null,
			mediaId: null,
			documentId: props.item.value,
			userId: null,
		} satisfies CFInsertItem<"document">;
	}
	cfSpecificValidation(
		value: unknown,
		relationData?: DocumentReferenceData[],
	) {
		const valueSchema = z.number();

		const valueValidate = zodSafeParse(value, valueSchema);
		if (!valueValidate.valid) return valueValidate;

		const findDocument = relationData?.find((d) => d.id === value);

		if (findDocument === undefined) {
			return {
				valid: false,
				message: T("field_document_not_found"),
			};
		}

		if (findDocument.collection_key !== this.config.collection) {
			return {
				valid: false,
				message: T("field_document_collection_key_mismatch", {
					expected: this.config.collection,
					received: findDocument.collection_key,
				}),
			};
		}

		return { valid: true };
	}
}

export default DocumentCustomField;
