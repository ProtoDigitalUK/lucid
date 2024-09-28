import T from "../../translations/index.js";
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
			publish: BooleanInt;
			userId: number;

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

	// update current draft if it exists and turn into a revision
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
				value: "draft",
			},
		],
		data: {
			version_type: "revision",
			previous_version_type: "draft",
			created_by: data.userId,
		},
	});

	// create new draft
	const newDraftVersion = await VersionsRepo.createSingle({
		document_id: data.documentId,
		version_type: "draft",
		created_by: data.userId,
	});
	if (newDraftVersion === undefined) {
		return {
			error: {
				type: "basic",
				status: 400,
			},
			data: undefined,
		};
	}
	// save bricks for the draft
	const createMultipleBricks =
		await context.services.collection.document.brick.createMultiple(context, {
			versionId: newDraftVersion.id,
			documentId: data.documentId,
			bricks: data.bricks,
			fields: data.fields,
			collection: data.collection,
		});
	if (createMultipleBricks.error) return createMultipleBricks;

	// TODO: if save and publish, clone new draft as published
	if (data.publish === 1) {
		console.log("publish draft (clones current draft as published)");
	}

	return {
		error: undefined,
		data: data.documentId,
	};
};

export default createSingle;
