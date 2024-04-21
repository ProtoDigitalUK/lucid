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
				textValue: field.textValue,
				intValue: field.intValue,
				boolValue: field.boolValue,
				jsonValue: field.jsonValue,
				pageLinkId: field.pageLinkId,
				mediaId: field.mediaId,
				userId: field.userId,
				languageId: field.languageId,
			};
		}),
	});
};

export default createMultipleFields;
