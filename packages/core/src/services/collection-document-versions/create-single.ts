import Repository from "../../libs/repositories/index.js";
import type { BrickSchema } from "../../schemas/collection-bricks.js";
import type { FieldSchemaType } from "../../schemas/collection-fields.js";
import type { CollectionBuilder } from "../../exports/builders.js";
import type { ServiceFn } from "../../utils/services/types.js";
import type { BooleanInt } from "../../libs/db/types.js";

const createSingle: ServiceFn<
	[
		{
			documentId: number;
			collection: CollectionBuilder;
			userId: number;
			publish: BooleanInt;
			bricks?: Array<BrickSchema>;
			fields?: Array<FieldSchemaType>;
		},
	],
	number
> = async (context, data) => {
	const VersionsRepo = Repository.get(
		"collection-document-versions",
		context.db,
	);

	const versionType = data.publish ? "published" : "draft";

	// Update the current version of the targeted type to a revision
	await VersionsRepo.updateSingle({
		where: [
			{
				key: "document_id",
				operator: "=",
				value: data.documentId,
			},
			{
				key: "version_type",
				operator: "=",
				value: versionType,
			},
		],
		data: {
			version_type: "revision",
			previous_version_type: versionType,
			created_by: data.userId,
		},
	});

	// Create new version (draft or published based on the publish value)
	const newVersion = await VersionsRepo.createSingle({
		document_id: data.documentId,
		version_type: versionType,
		created_by: data.userId,
	});

	if (newVersion === undefined) {
		return {
			error: {
				type: "basic",
				status: 400,
			},
			data: undefined,
		};
	}

	// Save bricks for the new version
	const createMultipleBricks =
		await context.services.collection.document.brick.createMultiple(context, {
			versionId: newVersion.id,
			documentId: data.documentId,
			bricks: data.bricks,
			fields: data.fields,
			collection: data.collection,
		});

	if (createMultipleBricks.error) return createMultipleBricks;

	return {
		error: undefined,
		data: data.documentId,
	};
};

export default createSingle;
