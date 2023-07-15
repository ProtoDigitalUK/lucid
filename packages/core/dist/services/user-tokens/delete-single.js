"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserToken_1 = __importDefault(require("../../db/models/UserToken"));
const deleteSingle = async (client, data) => {
    const userToken = await UserToken_1.default.deleteSingle(client, {
        id: data.id,
    });
    return userToken;
};
exports.default = deleteSingle;
//# sourceMappingURL=delete-single.js.map