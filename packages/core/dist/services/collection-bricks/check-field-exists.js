"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const CollectionBrick_1 = __importDefault(require("../../db/models/CollectionBrick"));
const checkFieldExists = async (data) => {
    const repeaterExists = await CollectionBrick_1.default.checkFieldExists({
        brick_id: data.brick_id,
        key: data.key,
        type: data.type,
        parent_repeater: data.parent_repeater,
        group_position: data.group_position,
    });
    if (!repeaterExists && !data.create) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Field Not Found",
            message: `The field cannot be updated because it does not exist.`,
            status: 409,
        });
    }
    else if (repeaterExists && data.create) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Field Already Exists",
            message: `The field cannot be created because it already exists.`,
            status: 409,
        });
    }
};
exports.default = checkFieldExists;
//# sourceMappingURL=check-field-exists.js.map