import formatCollection from "../../format/format-collection.js";

export interface ServiceData {
	include_document_id?: boolean;
}

const getAll = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const collections = serviceConfig.config.collections ?? [];

	if (data.include_document_id === true) {
		const singleCollections = collections.filter(
			(collection) => collection.data.mode === "single",
		);

		const documents = await serviceConfig.db
			.selectFrom("headless_collection_documents")
			.select(["collection_key", "id"])
			.where("is_deleted", "=", 0)
			.where(
				"collection_key",
				"in",
				singleCollections.map((collection) => collection.key),
			)
			.execute();

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
