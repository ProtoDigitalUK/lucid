"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const save_object_js_1 = __importDefault(require("./save-object.js"));
const delete_object_js_1 = __importDefault(require("./delete-object.js"));
const delete_objects_js_1 = __importDefault(require("./delete-objects.js"));
const update_object_key_js_1 = __importDefault(require("./update-object-key.js"));
exports.default = {
    saveObject: save_object_js_1.default,
    deleteObject: delete_object_js_1.default,
    deleteObjects: delete_objects_js_1.default,
    updateObjectKey: update_object_key_js_1.default,
};
//# sourceMappingURL=index.js.map