import T from "../../translations/index.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceFn } from "../../libs/services/types.js";
import type { CollectionResponse } from "../../types/response.js";

const getSingle: ServiceFn<
	[
		{
			key: string;
			include?: {
				bricks?: boolean;
				fields?: boolean;
				documentId?: boolean;
			};
		},
	],
	CollectionResponse
> = async (serviceConfig, data) => {
	const collection = serviceConfig.config.collections?.find(
		(c) => c.key === data.key,
	);

	if (collection === undefined) {
		return {
			error: {
				type: "basic",
				name: T("error_not_found_name", {
					name: T("collection"),
				}),
				message: T("collection_not_found_message", {
					collectionKey: data.key,
				}),
				status: 404,
			},
			data: undefined,
		};
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

		return {
			error: undefined,
			data: CollectionsFormatter.formatSingle({
				collection: collection,
				include: data.include,
				documents: [
					{
						id: document?.id,
						collection_key: collection.key,
					},
				],
			}),
		};
	}

	return {
		error: undefined,
		data: CollectionsFormatter.formatSingle({
			collection: collection,
			include: data.include,
		}),
	};
};

export default getSingle;
