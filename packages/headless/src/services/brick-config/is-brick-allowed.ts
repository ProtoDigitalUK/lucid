import brickConfigServices from "./index.js";
import getConfig from "../config.js";
import type {
	CollectionResT,
	CollectionBrickConfigT,
} from "@headless/types/src/collections.js";
import type { BrickConfigT } from "@headless/types/src/bricks.js";

export interface ServiceData {
	key: string;
	collection: CollectionResT;
	type?: "fixed" | "builder";
}

const isBrickAllowed = async (data: ServiceData) => {
	let allowed = false;
	const config = await getConfig();
	const builderInstances = config.bricks || [];

	const instance = builderInstances.find((b) => b.key === data.key);

	let builderBrick: CollectionBrickConfigT | undefined;
	let fixedBrick: CollectionBrickConfigT | undefined;

	if (!data.type) {
		builderBrick = data.collection.bricks?.find(
			(b) => b.key === data.key && b.type === "builder",
		);
		fixedBrick = data.collection.bricks?.find(
			(b) => b.key === data.key && b.type === "fixed",
		);
	} else {
		const brickF = data.collection.bricks?.find(
			(b) => b.key === data.key && b.type === data.type,
		);
		if (data.type === "builder") builderBrick = brickF;
		if (data.type === "fixed") fixedBrick = brickF;
	}

	if (instance && (builderBrick || fixedBrick)) allowed = true;

	let brick: BrickConfigT | undefined;
	if (instance) {
		brick = await brickConfigServices.getBrickData({
			instance: instance,
			query: {
				include: ["fields"],
			},
		});
	}

	return {
		allowed: allowed,
		brick: brick,
		collectionBrick: {
			builder: builderBrick,
			fixed: fixedBrick,
		},
	};
};

export default isBrickAllowed;
