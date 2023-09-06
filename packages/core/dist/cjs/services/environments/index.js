"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const delete_single_js_1 = __importDefault(require("./delete-single.js"));
const get_single_js_1 = __importDefault(require("./get-single.js"));
const get_all_js_1 = __importDefault(require("./get-all.js"));
const migrate_environment_js_1 = __importDefault(require("./migrate-environment.js"));
const upsert_single_js_1 = __importDefault(require("./upsert-single.js"));
const check_key_exists_js_1 = __importDefault(require("./check-key-exists.js"));
exports.default = {
    deleteSingle: delete_single_js_1.default,
    getSingle: get_single_js_1.default,
    getAll: get_all_js_1.default,
    migrateEnvironment: migrate_environment_js_1.default,
    upsertSingle: upsert_single_js_1.default,
    checkKeyExists: check_key_exists_js_1.default,
};
//# sourceMappingURL=index.js.map