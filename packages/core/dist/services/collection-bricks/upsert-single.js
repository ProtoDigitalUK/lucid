"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const CollectionBrick_1 = __importDefault(require("../../db/models/CollectionBrick"));
const brick_config_1 = __importDefault(require("../brick-config"));
const collection_bricks_1 = __importDefault(require("../collection-bricks"));
const upsertSingleWithFields = async (data) => {
    const promises = [];
    const allowed = brick_config_1.default.isBrickAllowed({
        key: data.brick.key,
        type: data.brick_type,
        environment: data.environment,
        collection: data.collection,
    });
    if (!allowed.allowed) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Brick not allowed",
            message: `The brick "${data.brick.key}" of type "${data.brick_type}" is not allowed in this collection. Check your assigned bricks in the collection and environment.`,
            status: 500,
        });
    }
    let brickId = data.brick.id;
    if (brickId) {
        const brickRes = await CollectionBrick_1.default.updateSingleBrick({
            order: data.order,
            brick: data.brick,
            brick_type: data.brick_type,
        });
        brickId = brickRes.id;
        if (!brickRes) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Page Brick Update Error",
                message: "Could not update page brick",
                status: 500,
            });
        }
    }
    else {
        const brickRes = await CollectionBrick_1.default.createSingleBrick({
            type: data.collection.type,
            reference_id: data.reference_id,
            order: data.order,
            brick: data.brick,
            brick_type: data.brick_type,
        });
        brickId = brickRes.id;
        if (!brickRes) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Page Brick Create Error",
                message: "Could not create page brick",
                status: 500,
            });
        }
    }
    if (!data.brick.fields)
        return brickId;
    for (const field of data.brick.fields) {
        if (field.type === "tab")
            continue;
        if (field.type === "repeater")
            promises.push(collection_bricks_1.default.upsertRepeater({
                brick_id: brickId,
                data: field,
            }));
        else
            promises.push(collection_bricks_1.default.upsertField({
                brick_id: brickId,
                data: field,
            }));
    }
    await Promise.all(promises);
    return brickId;
};
exports.default = upsertSingleWithFields;
//# sourceMappingURL=upsert-single.js.map