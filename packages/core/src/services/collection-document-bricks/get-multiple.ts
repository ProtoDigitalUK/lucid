import collectionsServices from "../collections/index.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";
import LanguagesRepo from "../../libs/repositories/languages.js";

export interface ServiceData {
	documentId: number;
	collectionKey: string;
}

const getMultiple = async (serviceConfig: ServiceConfig, data: ServiceData) => {
	const CollectionDocumentBricksRepo = Repository.get(
		"collection-document-bricks",
		serviceConfig.db,
	);
	const LanguagesRepo = Repository.get("languages", serviceConfig.db);

	const CollectionDocumentBricksFormatter = Formatter.get(
		"collection-document-bricks",
	);

	const [bricks, collection, defaultLanguage] = await Promise.all([
		CollectionDocumentBricksRepo.selectMultipleByDocumentId({
			documentId: data.documentId,
			config: serviceConfig.config,
		}),
		collectionsServices.getSingleInstance({
			key: data.collectionKey,
		}),
		LanguagesRepo.selectSingle({
			select: ["id"],
			where: [
				{
					key: "is_default",
					operator: "=",
					value: 1,
				},
			],
		}),
	]);

	return {
		bricks: CollectionDocumentBricksFormatter.formatMultiple({
			bricks: bricks,
			collection: collection,
			host: serviceConfig.config.host,
			defaultLanguageId: defaultLanguage?.id,
		}),
		fields: CollectionDocumentBricksFormatter.formatCollectionSudoBrick({
			bricks: bricks,
			collection: collection,
			host: serviceConfig.config.host,
			defaultLanguageId: defaultLanguage?.id,
		}),
	};
};

export default getMultiple;
