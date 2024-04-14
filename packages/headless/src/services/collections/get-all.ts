import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";

export interface ServiceData {
	includeDocumentId?: boolean;
}

const getAll = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const collections = serviceConfig.config.collections ?? [];

	const CollectionsFormatter = Formatter.get("collections");

	if (data.includeDocumentId === true) {
		const singleCollections = collections.filter(
			(collection) => collection.data.mode === "single",
		);

		const CollectionDocumentsRepo = Repository.get(
			"collection-documents",
			serviceConfig.db,
		);

		const documents = await CollectionDocumentsRepo.selectMultiple({
			select: ["collection_key", "id"],
			where: [
				{
					key: "is_deleted",
					operator: "=",
					value: 0,
				},
				{
					key: "collection_key",
					operator: "in",
					value: singleCollections.map((c) => c.key),
				},
			],
		});

		return CollectionsFormatter.formatMultiple({
			collections: collections,
			include: {
				bricks: false,
				fields: false,
				document_id: true,
			},
			documents: documents,
		});
	}

	return CollectionsFormatter.formatMultiple({
		collections: collections,
		include: {
			bricks: false,
			fields: false,
			document_id: false,
		},
	});
};

export default getAll;
