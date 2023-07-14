"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_single_1 = __importDefault(require("./create-single"));
const get_single_1 = __importDefault(require("./get-single"));
const delete_single_1 = __importDefault(require("./delete-single"));
exports.default = {
    createSingle: create_single_1.default,
    getSingle: get_single_1.default,
    deleteSingle: delete_single_1.default,
};
//# sourceMappingURL=index.js.map