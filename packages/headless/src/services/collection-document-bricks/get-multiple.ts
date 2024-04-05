import collectionsServices from "../collections/index.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";

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
	const CollectionDocumentBricksFormatter = Formatter.get(
		"collection-document-bricks",
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

	return CollectionDocumentBricksFormatter.formatMultiple({
		bricks: bricks,
		collection: collection,
		host: serviceConfig.config.host,
	});
};

export default getMultiple;
