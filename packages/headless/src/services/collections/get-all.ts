import formatCollection from "../../format/format-collection.js";
import getConfig from "../../libs/config/get-config.js";

export interface ServiceData {
	include_document_id?: boolean;
}

const getAll = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const config = await getConfig();

	const collections = config.collections ?? [];

	if (data.include_document_id === true) {
		const singleCollections = collections.filter(
			(collection) => collection.data.multiple === false,
		);

		const documents = await serviceConfig.db
			.selectFrom("headless_collection_documents")
			.select(["collection_key", "id"])
			.where("is_deleted", "=", false)
			.where(
				"collection_key",
				"in",
				singleCollections.map((collection) => collection.key),
			)
			.execute();

		return (
			collections.map((collection) =>
				formatCollection(
					collection,
					{
						bricks: false,
						fields: false,
						document_id: true,
					},
					documents,
				),
			) ?? []
		);
	}

	return (
		collections.map((collection) =>
			formatCollection(collection, {
				bricks: false,
				fields: false,
				document_id: false,
			}),
		) ?? []
	);
};

export default getAll;
