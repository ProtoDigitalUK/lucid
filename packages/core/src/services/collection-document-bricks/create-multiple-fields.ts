import type { BrickSchema } from "../../schemas/collection-bricks.js";
import type { GroupsResponse } from "./create-multiple-groups.js";
import { fieldCreatePrep } from "../../utils/field-helpers.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	documentId: number;
	bricks: Array<BrickSchema>;
	groups: Array<GroupsResponse>;
}

const createMultipleFields = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const fields = data.bricks.flatMap((brick) =>
		fieldCreatePrep({
			brick: brick,
			groups: data.groups,
		}),
	);

	if (fields.length === 0) {
		return;
	}

	const CollectionDocumentFieldsRepo = Repository.get(
		"collection-document-fields",
		serviceConfig.db,
	);

	await CollectionDocumentFieldsRepo.createMultiple({
		items: fields.map((field) => {
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
