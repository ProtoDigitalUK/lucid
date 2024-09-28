import T from "../../translations/index.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceFn } from "../../utils/services/types.js";

// TODO: down the line, this should instead clone the revision and turn it into a draft as opposed to turning the revision into a draft
//  - This will allow us to retain the revision history more completely

const restoreRevision: ServiceFn<
	[
		{
			documentId: number;
			versionId: number;
			userId: number;
		},
	],
	undefined
> = async (context, data) => {
	const VersionsRepo = Repository.get(
		"collection-document-versions",
		context.db,
	);

	// move current draft to a revision
	const moveDraftToRevisionRes = await VersionsRepo.updateSingle({
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
	if (moveDraftToRevisionRes === undefined) {
		return {
			error: {
				type: "basic",
				message: T("draft_version_not_moved_to_revision_message"),
				status: 400,
			},
			data: undefined,
		};
	}

	// turns revision into draft
	const restorRevisionRes = await VersionsRepo.updateSingle({
		where: [
			{
				key: "document_id",
				operator: "=",
				value: data.documentId,
			},
			{
				key: "id",
				operator: "=",
				value: data.versionId,
			},
		],
		data: {
			version_type: "draft",
			previous_version_type: "revision",
			created_by: data.userId,
		},
	});
	if (restorRevisionRes === undefined) {
		return {
			error: {
				type: "basic",
				message: T("revision_version_not_restored_message"),
				status: 400,
			},
			data: undefined,
		};
	}

	return {
		error: undefined,
		data: undefined,
	};
};

export default restoreRevision;
