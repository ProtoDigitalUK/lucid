"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CollectionBrick_1 = __importDefault(require("../../db/models/CollectionBrick"));
const collection_bricks_1 = __importDefault(require("../collection-bricks"));
const upsertRepeater = async (data) => {
    let repeaterId;
    const brickField = data.data;
    if (brickField.fields_id && brickField.group_position !== undefined) {
        const repeaterRes = await CollectionBrick_1.default.updateRepeater(brickField);
        repeaterId = repeaterRes.fields_id;
    }
    else {
        await collection_bricks_1.default.checkFieldExists({
            brick_id: data.brick_id,
            key: brickField.key,
            type: brickField.type,
            parent_repeater: brickField.parent_repeater,
            group_position: brickField.group_position,
            create: true,
        });
        const repeaterRes = await CollectionBrick_1.default.createRepeater(data.brick_id, data.data);
        repeaterId = repeaterRes.fields_id;
    }
    if (!brickField.items)
        return;
    const promises = [];
    for (let i = 0; i < brickField.items.length; i++) {
        const item = brickField.items[i];
        if (item.type === "tab")
            continue;
        item.parent_repeater = repeaterId;
        if (item.type === "repeater") {
            promises.push(collection_bricks_1.default.upsertRepeater({
                brick_id: data.brick_id,
                data: item,
            }));
            continue;
        }
        promises.push(collection_bricks_1.default.upsertField({
            brick_id: data.brick_id,
            data: item,
        }));
    }
    await Promise.all(promises);
};
exports.default = upsertRepeater;
//# sourceMappingURL=upsert-repeater.js.map