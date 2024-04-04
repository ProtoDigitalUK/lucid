import formatCollection from "../../format/format-collection.js";
import RepositoryFactory from "../../libs/repositories/index.js";

export interface ServiceData {
	include_document_id?: boolean;
}

const getAll = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const collections = serviceConfig.config.collections ?? [];

	if (data.include_document_id === true) {
		const singleCollections = collections.filter(
			(collection) => collection.data.mode === "single",
		);

		const CollectionDocumentsRepo = RepositoryFactory.getRepository(
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

		return (
			collections.map((collection) =>
				formatCollection({
					collection: collection,
					include: {
						bricks: false,
						fields: false,
						document_id: true,
					},
					documents,
				}),
			) ?? []
		);
	}

	return (
		collections.map((collection) =>
			formatCollection({
				collection: collection,
				include: {
					bricks: false,
					fields: false,
					document_id: false,
				},
			}),
		) ?? []
	);
};

export default getAll;
