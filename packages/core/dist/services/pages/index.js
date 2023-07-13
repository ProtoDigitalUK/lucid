"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_single_1 = __importDefault(require("./create-single"));
const delete_single_1 = __importDefault(require("./delete-single"));
const get_multiple_1 = __importDefault(require("./get-multiple"));
const get_single_1 = __importDefault(require("./get-single"));
const update_single_1 = __importDefault(require("./update-single"));
const check_page_exists_1 = __importDefault(require("./check-page-exists"));
const build_unique_slug_1 = __importDefault(require("./build-unique-slug"));
const parent_checks_1 = __importDefault(require("./parent-checks"));
const reset_homepages_1 = __importDefault(require("./reset-homepages"));
const get_multiple_by_id_1 = __importDefault(require("./get-multiple-by-id"));
exports.default = {
    createSingle: create_single_1.default,
    deleteSingle: delete_single_1.default,
    getMultiple: get_multiple_1.default,
    getSingle: get_single_1.default,
    updateSingle: update_single_1.default,
    checkPageExists: check_page_exists_1.default,
    buildUniqueSlug: build_unique_slug_1.default,
    parentChecks: parent_checks_1.default,
    resetHomepages: reset_homepages_1.default,
    getMultipleById: get_multiple_by_id_1.default,
};
//# sourceMappingURL=index.js.map