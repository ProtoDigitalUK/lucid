import brickConfigServices from "./index.js";
import getConfig from "../config.js";
import type { CollectionBrickConfigT } from "../../builders/collection-builder/index.js";
import type { CollectionResT } from "@headless/types/src/collections.js";
import type { BrickConfigT } from "@headless/types/src/bricks.js";

export interface ServiceData {
	collection: CollectionResT;
}

const getAllowedBricks = async (data: ServiceData) => {
	const config = await getConfig();

	const allowedBricks: BrickConfigT[] = [];
	const allowedCollectionBricks: CollectionBrickConfigT[] = [];
	const builderInstances = config.bricks || [];

	for (const brick of builderInstances) {
		const brickAllowed = await brickConfigServices.isBrickAllowed({
			key: brick.key,
			collection: data.collection,
		});

		if (brickAllowed.allowed && brickAllowed.brick)
			allowedBricks.push(brickAllowed.brick);

		if (brickAllowed.allowed && brickAllowed.collectionBrick) {
			if (brickAllowed.collectionBrick.builder)
				allowedCollectionBricks.push(
					brickAllowed.collectionBrick.builder,
				);
			if (brickAllowed.collectionBrick.fixed)
				allowedCollectionBricks.push(
					brickAllowed.collectionBrick.fixed,
				);
		}
	}

	return {
		bricks: allowedBricks,
		collectionBricks: allowedCollectionBricks,
	};
};

export default getAllowedBricks;
