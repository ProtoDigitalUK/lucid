import T from "../../translations/index.js";
import type { ServiceFn } from "../../utils/services/types.js";

const restoreRevision: ServiceFn<
	[
		{
			documentId: number;
			versionId: number;
			userId: number;
			collectionKey: string;
		},
	],
	undefined
> = async (context, data) => {
	const collectionRes = await context.services.collection.getSingleInstance(
		context,
		{
			key: data.collectionKey,
		},
	);
	if (collectionRes.error) return collectionRes;

	if (collectionRes.data.config.useRevisions === false) {
		return {
			error: {
				type: "basic",
				name: T("revisions_not_enabled_error_name"),
				message: T("revisions_not_enabled_message"),
				status: 400,
			},
			data: undefined,
		};
	}

	await context.services.collection.document.versions.promoteVersioe(context, {
		documentId: data.documentId,
		collectionKey: data.collectionKey,
		fromVersionId: data.versionId,
		toVersionType: collectionRes.data.config.useDrafts ? "draft" : "published",
		userId: data.userId,
		skipRevisionCheck: true,
	});

	return {
		error: undefined,
		data: undefined,
	};
};

export default restoreRevision;
