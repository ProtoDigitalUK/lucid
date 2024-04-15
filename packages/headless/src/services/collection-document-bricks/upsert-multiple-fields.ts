import type { BrickSchemaT } from "../../schemas/collection-bricks.js";
import type { GroupsResT } from "./upsert-multiple-groups.js";
import { fieldUpsertPrep } from "../../utils/field-helpers.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	documentId: number;
	bricks: Array<BrickSchemaT>;
	groups: Array<GroupsResT>;
}

const upsertMultipleFields = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	// format fields
	const fields = data.bricks.flatMap((brick) =>
		fieldUpsertPrep({
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

	// upsert fields
	const fieldsRes = await CollectionDocumentFieldsRepo.upsertMultiple({
		items: fields.map((field) => {
			return {
				fieldsId: field.fieldsId ?? undefined,
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
				languageId: field.languageId,
			};
		}),
	});

	// delete fields not in fieldsRes
	await CollectionDocumentFieldsRepo.deleteMultiple({
		where: [
			{
				key: "collection_brick_id",
				operator: "in",
				value: fields.map((f) => f.collectionBrickId),
			},
			{
				key: "fields_id",
				operator: "not in",
				value: fieldsRes.map((f) => f.fields_id),
			},
		],
	});
};

export default upsertMultipleFields;
