import type { BrickSchemaT } from "../../schemas/collection-bricks.js";
import formatUpsertFields from "../../format/format-upsert-fields.js";
import type { GroupsResT } from "./upsert-multiple-groups.js";
import RepositoryFactory from "../../libs/repositories/index.js";

export interface ServiceData {
	document_id: number;
	bricks: Array<BrickSchemaT>;
	groups: Array<GroupsResT>;
}

const upsertMultipleFields = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	// format fields
	const fields = data.bricks.flatMap((brick) =>
		formatUpsertFields({
			brick: brick,
			groups: data.groups,
		}),
	);

	if (fields.length === 0) {
		return;
	}

	const CollectionDocumentFieldsRepo = RepositoryFactory.getRepository(
		"collection-document-fields",
		serviceConfig.db,
	);

	// upsert fields
	const fieldsRes = await CollectionDocumentFieldsRepo.upsertMultiple({
		items: fields.map((field) => {
			return {
				fieldsId: field.fields_id ?? undefined,
				collectionDocumentId: data.document_id,
				collectionBrickId: field.collection_brick_id,
				key: field.key,
				type: field.type,
				groupId: field.group_id,
				textValue: field.text_value,
				intValue: field.int_value,
				boolValue: field.bool_value,
				jsonValue: field.json_value,
				pageLinkId: field.page_link_id,
				mediaId: field.media_id,
				languageId: field.language_id,
			};
		}),
	});

	// delete fields not in fieldsRes
	await CollectionDocumentFieldsRepo.deleteMultiple({
		where: [
			{
				key: "collection_brick_id",
				operator: "in",
				value: fields.map((f) => f.collection_brick_id),
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
