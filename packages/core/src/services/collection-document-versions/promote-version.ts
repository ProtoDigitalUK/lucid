import Repository from "../../libs/repositories/index.js";
import executeHooks from "../../utils/hooks/execute-hooks.js";
import merge from "lodash.merge";
import type { BrickSchema } from "../../schemas/collection-bricks.js";
import type { FieldSchemaType } from "../../schemas/collection-fields.js";
import type { CollectionBuilder } from "../../exports/builders.js";
import type { ServiceFn } from "../../utils/services/types.js";
import type { BooleanInt } from "../../libs/db/types.js";

const promoteVersion: ServiceFn<
	[
		{
			fromVersionId: number;
			toVersionType: "draft" | "published";
			collectionKey: string;
			documentId: number;
			userId: number;
		},
	],
	undefined
> = async (context, data) => {
	// check that the fromVersionId is not a revision - there is an endpoint for that alreayd

	// clones the given version and sets the type to the given type
	// fetch the document version as would the get document route
	// format / strip data however needed
	// create a new version from that data
	// if the target is published or draft and revisions are enabled on the collection, update the current version to a revision otherwise delete it

	const VersionsRepo = Repository.get(
		"collection-document-versions",
		context.db,
	);

	console.log("data", data);

	return {
		error: undefined,
		data: undefined,
	};
};

export default promoteVersion;
