import collectionsServices from "../collections/index.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	documentId: number;
	collectionKey: string;
}

const getMultiple = async (serviceConfig: ServiceConfig, data: ServiceData) => {
	const CollectionDocumentBricksRepo = Repository.get(
		"collection-document-bricks",
		serviceConfig.db,
	);
	const CollectionDocumentBricksFormatter = Formatter.get(
		"collection-document-bricks",
	);

	const [bricks, collection] = await Promise.all([
		CollectionDocumentBricksRepo.selectMultipleByDocumentId({
			documentId: data.documentId,
			config: serviceConfig.config,
		}),
		collectionsServices.getSingleInstance({
			key: data.collectionKey,
		}),
	]);

	return CollectionDocumentBricksFormatter.formatMultiple({
		bricks: bricks,
		collection: collection,
		host: serviceConfig.config.host,
	});
};

export default getMultiple;
