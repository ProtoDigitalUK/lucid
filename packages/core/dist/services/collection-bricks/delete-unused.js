"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const CollectionBrick_1 = __importDefault(require("../../db/models/CollectionBrick"));
const deleteUnused = async (data) => {
    const allBricks = await CollectionBrick_1.default.getAllBricks(data.type, data.reference_id, data.brick_type);
    const brickIds = allBricks.map((brick) => brick.id);
    const bricksToDelete = brickIds.filter((id) => !data.brick_ids.includes(id));
    const promises = bricksToDelete.map((id) => CollectionBrick_1.default.deleteSingleBrick(id));
    try {
        await Promise.all(promises);
    }
    catch (err) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Brick Delete Error",
            message: `There was an error deleting bricks for "${data.type}" of ID "${data.reference_id}"!`,
            status: 500,
        });
    }
};
exports.default = deleteUnused;
//# sourceMappingURL=delete-unused.js.map