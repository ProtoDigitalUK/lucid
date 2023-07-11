"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_multiple_1 = __importDefault(require("./create-multiple"));
const delete_multiple_1 = __importDefault(require("./delete-multiple"));
const delete_all_1 = __importDefault(require("./delete-all"));
const get_all_1 = __importDefault(require("./get-all"));
exports.default = {
    createMultiple: create_multiple_1.default,
    deleteMultiple: delete_multiple_1.default,
    deleteAll: delete_all_1.default,
    getAll: get_all_1.default,
};
//# sourceMappingURL=index.js.map