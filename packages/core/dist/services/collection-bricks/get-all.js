"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CollectionBrick_1 = __importDefault(require("../../db/models/CollectionBrick"));
const format_bricks_1 = __importDefault(require("../../utils/format/format-bricks"));
const getAll = async (data) => {
    const brickFields = await CollectionBrick_1.default.getAll({
        reference_id: data.reference_id,
        type: data.type,
    });
    if (!brickFields) {
        return {
            builder_bricks: [],
            fixed_bricks: [],
        };
    }
    const formmatedBricks = await (0, format_bricks_1.default)({
        brick_fields: brickFields,
        environment_key: data.environment_key,
        collection: data.collection,
    });
    return {
        builder_bricks: formmatedBricks.filter((brick) => brick.type === "builder"),
        fixed_bricks: formmatedBricks.filter((brick) => brick.type !== "builder"),
    };
};
exports.default = getAll;
//# sourceMappingURL=get-all.js.map