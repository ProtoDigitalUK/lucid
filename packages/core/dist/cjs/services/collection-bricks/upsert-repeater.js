"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const CollectionBrick_js_1 = __importDefault(require("../../db/models/CollectionBrick.js"));
const index_js_1 = __importDefault(require("../collection-bricks/index.js"));
const upsertRepeater = async (client, data) => {
    let repeaterId;
    const brickField = data.data;
    if (brickField.fields_id && brickField.group_position !== undefined) {
        const repeaterRes = await CollectionBrick_js_1.default.updateRepeater(client, {
            field: brickField,
        });
        repeaterId = repeaterRes.fields_id;
    }
    else {
        await (0, service_js_1.default)(index_js_1.default.checkFieldExists, false, client)({
            brick_id: data.brick_id,
            key: brickField.key,
            type: brickField.type,
            parent_repeater: brickField.parent_repeater,
            group_position: brickField.group_position,
            create: true,
        });
        const repeaterRes = await CollectionBrick_js_1.default.createRepeater(client, {
            brick_id: data.brick_id,
            field: brickField,
        });
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
            promises.push((0, service_js_1.default)(index_js_1.default.upsertRepeater, false, client)({
                brick_id: data.brick_id,
                data: item,
            }));
            continue;
        }
        promises.push((0, service_js_1.default)(index_js_1.default.upsertField, false, client)({
            brick_id: data.brick_id,
            data: item,
        }));
    }
    await Promise.all(promises);
};
exports.default = upsertRepeater;
//# sourceMappingURL=upsert-repeater.js.map