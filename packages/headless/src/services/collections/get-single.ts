import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import formatCollection from "../../format/format-collection.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	key: string;
	include?: {
		bricks?: boolean;
		fields?: boolean;
		document_id?: boolean;
	};
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const collection = serviceConfig.config.collections?.find(
		(c) => c.key === data.key,
	);

	if (collection === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("collection"),
			}),
			message: T("collection_not_found_message", {
				collectionKey: data.key,
			}),
			status: 404,
		});
	}

	if (
		data.include?.document_id === true &&
		collection.data.mode === "single"
	) {
		const CollectionDocumentsRepo = Repository.get(
			"collection-documents",
			serviceConfig.db,
		);

		const document = await CollectionDocumentsRepo.selectSingle({
			select: ["id"],
			where: [
				{
					key: "is_deleted",
					operator: "=",
					value: 0,
				},
				{
					key: "collection_key",
					operator: "=",
					value: collection.key,
				},
			],
		});

		return formatCollection({
			collection: collection,
			include: {
				bricks: false,
				fields: false,
				document_id: true,
			},
			documents: [
				{
					id: document?.id,
					collection_key: collection.key,
				},
			],
		});
	}

	return formatCollection({
		collection: collection,
		include: data.include,
	});
};

export default getSingle;
