import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";
import type formatInsertFields from "./helpers/format-insert-fields.js";

export interface ServiceData {
	documentId: number;
	fields: ReturnType<typeof formatInsertFields>;
}

const createMultipleFields = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	if (data.fields.length === 0) {
		return;
	}

	const CollectionDocumentFieldsRepo = Repository.get(
		"collection-document-fields",
		serviceConfig.db,
	);

	await CollectionDocumentFieldsRepo.createMultiple({
		items: data.fields.map((field) => {
			return {
				collectionDocumentId: data.documentId,
				collectionBrickId: field.collectionBrickId,
				key: field.key,
				type: field.type,
				groupId: field.groupId,
				textValue: field.textValue ?? null,
				intValue: field.intValue ?? null,
				boolValue: field.boolValue ?? null,
				jsonValue: field.jsonValue ?? null,
				mediaId: field.mediaId ?? null,
				userId: field.userId ?? null,
				localeCode: field.localeCode,
			};
		}),
	});
};

export default createMultipleFields;
