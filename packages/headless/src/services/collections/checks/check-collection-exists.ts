import getConfig from "../../../libs/config/get-config.js";

export interface ServiceData {
	key: string;
}

const checkCollectionExists = async (data: ServiceData) => {
	const config = await getConfig();

	const collectionExists = config.collections?.find(
		(c) => c.key === data.key,
	);

	return collectionExists !== undefined;
};

export default checkCollectionExists;
