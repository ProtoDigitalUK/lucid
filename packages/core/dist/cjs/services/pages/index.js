"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_single_js_1 = __importDefault(require("./create-single.js"));
const delete_single_js_1 = __importDefault(require("./delete-single.js"));
const get_multiple_js_1 = __importDefault(require("./get-multiple.js"));
const get_single_js_1 = __importDefault(require("./get-single.js"));
const update_single_js_1 = __importDefault(require("./update-single.js"));
const check_page_exists_js_1 = __importDefault(require("./check-page-exists.js"));
const build_unique_slug_js_1 = __importDefault(require("./build-unique-slug.js"));
const parent_checks_js_1 = __importDefault(require("./parent-checks.js"));
const reset_homepages_js_1 = __importDefault(require("./reset-homepages.js"));
const get_multiple_by_id_js_1 = __importDefault(require("./get-multiple-by-id.js"));
exports.default = {
    createSingle: create_single_js_1.default,
    deleteSingle: delete_single_js_1.default,
    getMultiple: get_multiple_js_1.default,
    getSingle: get_single_js_1.default,
    updateSingle: update_single_js_1.default,
    checkPageExists: check_page_exists_js_1.default,
    buildUniqueSlug: build_unique_slug_js_1.default,
    parentChecks: parent_checks_js_1.default,
    resetHomepages: reset_homepages_js_1.default,
    getMultipleById: get_multiple_by_id_js_1.default,
};
//# sourceMappingURL=index.js.map