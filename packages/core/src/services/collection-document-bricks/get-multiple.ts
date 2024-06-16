import collectionsServices from "../collections/index.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import type { ServiceFn } from "../../libs/services/types.js";
import type { BrickResponse, FieldResponse } from "../../types/response.js";

const getMultiple: ServiceFn<
	[
		{
			documentId: number;
			collectionKey: string;
		},
	],
	{
		bricks: Array<BrickResponse>;
		fields: Array<FieldResponse>;
	}
> = async (serviceConfig, data) => {
	const CollectionDocumentBricksRepo = Repository.get(
		"collection-document-bricks",
		serviceConfig.db,
	);

	const CollectionDocumentBricksFormatter = Formatter.get(
		"collection-document-bricks",
	);

	const [bricks, collectionRes] = await Promise.all([
		CollectionDocumentBricksRepo.selectMultipleByDocumentId({
			documentId: data.documentId,
			config: serviceConfig.config,
		}),
		serviceWrapper(collectionsServices.getSingleInstance, {
			transaction: false,
		})(serviceConfig, {
			key: data.collectionKey,
		}),
	]);
	if (collectionRes.error) return collectionRes;

	return {
		error: undefined,
		data: {
			bricks: CollectionDocumentBricksFormatter.formatMultiple({
				bricks: bricks,
				collection: collectionRes.data,
				host: serviceConfig.config.host,
				localisation: {
					locales: serviceConfig.config.localisation.locales.map(
						(l) => l.code,
					),
					default: serviceConfig.config.localisation.defaultLocale,
				},
			}),
			fields: CollectionDocumentBricksFormatter.formatCollectionPseudoBrick(
				{
					bricks: bricks,
					collection: collectionRes.data,
					host: serviceConfig.config.host,
					localisation: {
						locales: serviceConfig.config.localisation.locales.map(
							(l) => l.code,
						),
						default:
							serviceConfig.config.localisation.defaultLocale,
					},
				},
			),
		},
	};
};

export default getMultiple;
