import T from "../../translations/index.js";
import Repository from "../../libs/repositories/index.js";
import executeHooks from "../../utils/hooks/execute-hooks.js";
import type { BrickSchema } from "../../schemas/collection-bricks.js";
import type { FieldSchemaType } from "../../schemas/collection-fields.js";
import type { ServiceFn } from "../../utils/services/types.js";
import type { BooleanInt } from "../../libs/db/types.js";
import type {
	CollectionDocumentResponse,
	FieldResponse,
	BrickResponse,
} from "../../exports/types.js";

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
	const VersionsRepo = Repository.get(
		"collection-document-versions",
		context.db,
	);
	const DocumentRepo = Repository.get("collection-documents", context.db);

	// fetch the collection and version
	const [collectionRes, versionRes] = await Promise.all([
		context.services.collection.getSingleInstance(context, {
			key: data.collectionKey,
		}),
		VersionsRepo.selectSingle({
			select: ["id", "version_type"],
			where: [
				{
					key: "id",
					operator: "=",
					value: data.fromVersionId,
				},
			],
		}),
	]);

	if (collectionRes.error) return collectionRes;
	if (versionRes === undefined) {
		return {
			error: {
				type: "basic",
				status: 400,
				message: T("document_version_not_found_message"),
			},
			data: undefined,
		};
	}
	// error if the target version is a revision
	if (versionRes.version_type === "revision") {
		return {
			error: {
				type: "basic",
				status: 400,
				message: T("cannot_promote_revision_message"),
			},
			data: undefined,
		};
	}
	// error if the target version is draft and the collection is not configured to use drafts
	if (
		collectionRes.data.config.useDrafts !== true &&
		data.toVersionType === "draft"
	) {
		return {
			error: {
				type: "basic",
				message: T("cannot_promote_to_draft_message"),
				status: 400,
			},
			data: undefined,
		};
	}
	// error if the collection is locked
	if (collectionRes.data.config.locked === true) {
		return {
			error: {
				type: "basic",
				name: T("error_locked_collection_name"),
				message: T("error_locked_collection_message"),
				status: 400,
			},
			data: undefined,
		};
	}

	//-------------------------------------------------------------------------------
	// Fetch the target document and all of its bricks/fields/groups
	const targetDocumentRes =
		await context.services.collection.document.getSingle(context, {
			collectionKey: data.collectionKey,
			id: data.documentId,
			versionId: data.fromVersionId,
			query: {
				include: ["bricks"],
			},
		});
	if (targetDocumentRes.error) return targetDocumentRes;

	//-------------------------------------------------------------------------------
	// Delete / move the target document version
	const useRevisions = collectionRes.data.config.useRevisions ?? false;
	if (useRevisions) {
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
					value: data.toVersionType,
				},
			],
			data: {
				version_type: "revision",
				previous_version_type: data.toVersionType,
				created_by: data.userId,
			},
		});
	} else {
		await VersionsRepo.deleteSingle({
			where: [
				{
					key: "document_id",
					operator: "=",
					value: data.documentId,
				},
				{
					key: "version_type",
					operator: "=",
					value: data.toVersionType,
				},
			],
		});
	}

	// -------------------------------------------------------------------------------
	// Upsert document
	const [document, version] = await Promise.all([
		DocumentRepo.upsertSingle({
			id: data.documentId,
			collectionKey: data.collectionKey,
			createdBy: data.userId,
			updatedBy: data.userId,
			isDeleted: 0,
			updatedAt: new Date().toISOString(),
		}),
		VersionsRepo.createSingle({
			document_id: data.documentId,
			version_type: data.toVersionType,
			created_by: data.userId,
		}),
	]);
	if (document === undefined) {
		return {
			error: {
				type: "basic",
				status: 400,
			},
			data: undefined,
		};
	}
	if (version === undefined) {
		return {
			error: {
				type: "basic",
				status: 400,
			},
			data: undefined,
		};
	}

	// format data to schema format
	const bricksCreateData = documentResponseToSchemaFormat(
		targetDocumentRes.data,
	);

	// create bricks/groups/fields
	await context.services.collection.document.brick.createMultiple(context, {
		versionId: version.id,
		documentId: data.documentId,
		bricks: bricksCreateData.bricks,
		fields: bricksCreateData.fields,
		collection: collectionRes.data,
		skipValidation: true, // skip validation as we can assume data in db is valid already, also we dont want field validation errors as likley wont be a way to fix them in UI
	});

	// fire version promote hook
	const hookResponse = await executeHooks(
		{
			service: "collection-documents",
			event: "versionPromote",
			config: context.config,
			collectionInstance: collectionRes.data,
		},
		context,
		{
			meta: {
				collectionKey: data.collectionKey,
				userId: data.userId,
			},
			data: {
				documentId: data.documentId,
				versionId: version.id,
				versionType: data.toVersionType,
			},
		},
	);
	if (hookResponse.error) return hookResponse;

	return {
		error: undefined,
		data: undefined,
	};
};

const documentResponseToSchemaFormat = (
	document: CollectionDocumentResponse,
): {
	bricks: Array<BrickSchema>;
	fields: Array<FieldSchemaType>;
} => {
	const formatField = (field: FieldResponse): FieldSchemaType | null => {
		if (field.type === "tab") return null;

		const formattedField: FieldSchemaType = {
			key: field.key,
			type: field.type,
			translations: field.translations,
			value: field.value,
		};

		if (field.groups) {
			formattedField.groups = field.groups.map((group) => ({
				id: group.id,
				order: group.order,
				open: group.open as BooleanInt | undefined,
				fields: group.fields.map(formatField).filter((f) => f !== null),
			}));
		}

		return formattedField;
	};

	const formatBrick = (brick: BrickResponse): BrickSchema => ({
		id: brick.id,
		key: brick.key,
		order: brick.order,
		type: brick.type,
		open: brick.open as BooleanInt | undefined,
		fields: brick.fields.map(formatField).filter((f) => f !== null),
	});

	return {
		bricks: document.bricks?.map(formatBrick) || [],
		fields: document.fields?.map(formatField).filter((f) => f !== null) || [],
	};
};

export default promoteVersion;
