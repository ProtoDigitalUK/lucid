import formatCollection from "../../format/format-collection.js";
import getConfig from "../config.js";

const getAll = async () => {
	const config = await getConfig();

	return (
		config.collections?.map((collection) => formatCollection(collection)) ??
		[]
	);
};

export default getAll;
