import brickConfigService from "../brick-config/index.js";
const getAllAllowedBricks = (data) => {
    const allowedBricks = [];
    const allowedCollectionBricks = [];
    const brickConfigData = brickConfigService.getBrickConfig();
    for (const brick of brickConfigData) {
        const brickAllowed = brickConfigService.isBrickAllowed({
            key: brick.key,
            collection: data.collection,
            environment: data.environment,
        });
        if (brickAllowed.allowed && brickAllowed.brick) {
            allowedBricks.push(brickAllowed.brick);
        }
        if (brickAllowed.allowed && brickAllowed.collectionBrick) {
            if (brickAllowed.collectionBrick.builder)
                allowedCollectionBricks.push(brickAllowed.collectionBrick.builder);
            if (brickAllowed.collectionBrick.fixed)
                allowedCollectionBricks.push(brickAllowed.collectionBrick.fixed);
        }
    }
    return {
        bricks: allowedBricks,
        collectionBricks: allowedCollectionBricks,
    };
};
export default getAllAllowedBricks;
//# sourceMappingURL=get-all-allowed-bricks.js.map