import collectionsServices from "../collections/index.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceFn } from "../../utils/services/types.js";
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
> = async (service, data) => {
	const CollectionDocumentBricksRepo = Repository.get(
		"collection-document-bricks",
		service.db,
	);

	const CollectionDocumentBricksFormatter = Formatter.get(
		"collection-document-bricks",
	);

	const [bricks, collectionRes] = await Promise.all([
		CollectionDocumentBricksRepo.selectMultipleByDocumentId({
			documentId: data.documentId,
			config: service.config,
		}),
		collectionsServices.getSingleInstance(service, {
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
				host: service.config.host,
				localisation: {
					locales: service.config.localisation.locales.map(
						(l) => l.code,
					),
					default: service.config.localisation.defaultLocale,
				},
			}),
			fields: CollectionDocumentBricksFormatter.formatCollectionPseudoBrick(
				{
					bricks: bricks,
					collection: collectionRes.data,
					host: service.config.host,
					localisation: {
						locales: service.config.localisation.locales.map(
							(l) => l.code,
						),
						default: service.config.localisation.defaultLocale,
					},
				},
			),
		},
	};
};

export default getMultiple;
