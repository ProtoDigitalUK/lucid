"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const delete_single_1 = __importDefault(require("./delete-single"));
const get_single_1 = __importDefault(require("./get-single"));
const get_all_1 = __importDefault(require("./get-all"));
const migrate_environment_1 = __importDefault(require("./migrate-environment"));
const upsert_single_1 = __importDefault(require("./upsert-single"));
exports.default = {
    deleteSingle: delete_single_1.default,
    getSingle: get_single_1.default,
    getAll: get_all_1.default,
    migrateEnvironment: migrate_environment_1.default,
    upsertSingle: upsert_single_1.default,
};
//# sourceMappingURL=index.js.map