import collectionsServices from "../collections/index.js";
import formatCollectionBricks from "../../format/format-collection-bricks.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	document_id: number;
	collection_key: string;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const CollectionDocumentBricksRepo = Repository.get(
		"collection-document-bricks",
		serviceConfig.db,
	);

	const [bricks, collection] = await Promise.all([
		CollectionDocumentBricksRepo.selectMultipleByDocumentId({
			documentId: data.document_id,
			config: serviceConfig.config,
		}),
		collectionsServices.getSingleInstance({
			key: data.collection_key,
		}),
	]);

	return formatCollectionBricks({
		bricks: bricks,
		collection: collection,
		host: serviceConfig.config.host,
	});
};

export default getMultiple;
