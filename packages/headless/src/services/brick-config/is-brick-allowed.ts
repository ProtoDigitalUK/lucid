import brickConfigServices from "./index.js";
import getConfig from "../config.js";
import type { CollectionResT } from "@headless/types/src/collections.js";
import type { EnvironmentResT } from "@headless/types/src/environments.js";
import type { CollectionBrickConfigT } from "../../builders/collection-builder/index.js";
import type { BrickConfigT } from "@headless/types/src/bricks.js";

export interface ServiceData {
	key: string;
	collection: CollectionResT;
	environment: EnvironmentResT;
	type?: CollectionBrickConfigT["type"];
}

const isBrickAllowed = async (data: ServiceData) => {
	// checks if the brick is allowed in the collection and environment and that there is config for it
	let allowed = false;
	const config = await getConfig();
	const builderInstances = config.bricks || [];

	const instance = builderInstances.find((b) => b.key === data.key);
	const envAssigned = (data.environment.assigned_bricks || [])?.includes(
		data.key,
	);

	let builderBrick: CollectionBrickConfigT | undefined;
	let fixedBrick: CollectionBrickConfigT | undefined;

	if (!data.type) {
		builderBrick = data.collection.bricks?.find(
			(b) => b.key === data.key && b.type === "builder",
		) as CollectionBrickConfigT | undefined;

		fixedBrick = data.collection.bricks?.find(
			(b) => b.key === data.key && b.type === "fixed",
		) as CollectionBrickConfigT | undefined;
	} else {
		const brickF = data.collection.bricks?.find(
			(b) => b.key === data.key && b.type === data.type,
		) as CollectionBrickConfigT | undefined;
		if (data.type === "builder") builderBrick = brickF;
		if (data.type === "fixed") fixedBrick = brickF;
	}

	// Set response data
	if (instance && envAssigned && (builderBrick || fixedBrick)) allowed = true;

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
