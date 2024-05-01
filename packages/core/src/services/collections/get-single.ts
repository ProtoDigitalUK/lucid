import T from "../../translations/index.js";
import { HeadlessAPIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	key: string;
	include?: {
		bricks?: boolean;
		fields?: boolean;
		documentId?: boolean;
	};
}

const getSingle = async (serviceConfig: ServiceConfig, data: ServiceData) => {
	const collection = serviceConfig.config.collections?.find(
		(c) => c.key === data.key,
	);

	if (collection === undefined) {
		throw new HeadlessAPIError({
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

	const CollectionsFormatter = Formatter.get("collections");

	if (
		data.include?.documentId === true &&
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

		return CollectionsFormatter.formatSingle({
			collection: collection,
			include: data.include,
			documents: [
				{
					id: document?.id,
					collection_key: collection.key,
				},
			],
		});
	}

	return CollectionsFormatter.formatSingle({
		collection: collection,
		include: data.include,
	});
};

export default getSingle;
