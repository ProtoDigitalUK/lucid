"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const save_object_1 = __importDefault(require("./save-object"));
const delete_object_1 = __importDefault(require("./delete-object"));
const delete_objects_1 = __importDefault(require("./delete-objects"));
exports.default = {
    saveObject: save_object_1.default,
    deleteObject: delete_object_1.default,
    deleteObjects: delete_objects_1.default,
};
//# sourceMappingURL=index.js.map