"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const format_collections_js_1 = __importDefault(require("../../utils/format/format-collections.js"));
const Config_js_1 = __importDefault(require("../Config.js"));
const index_js_1 = __importDefault(require("../brick-config/index.js"));
const index_js_2 = __importDefault(require("../environments/index.js"));
const getSingle = async (client, data) => {
    const instances = Config_js_1.default.collections || [];
    if (!instances) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Collection not found",
            message: `Collection with key "${data.collection_key}" under environment "${data.environment_key}" not found`,
            status: 404,
        });
    }
    const collectionsF = instances.map((collection) => (0, format_collections_js_1.default)(collection));
    const environment = data.environment
        ? data.environment
        : await (0, service_js_1.default)(index_js_2.default.getSingle, false, client)({
            key: data.environment_key,
        });
    const assignedCollections = environment.assigned_collections || [];
    let collection;
    if (data.type) {
        collection = collectionsF.find((c) => {
            return (c.key === data.collection_key &&
                c.type === data.type &&
                assignedCollections.includes(c.key));
        });
    }
    else {
        collection = collectionsF.find((c) => {
            return (c.key === data.collection_key && assignedCollections.includes(c.key));
        });
    }
    if (!collection) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Collection not found",
            message: `Collection with key "${data.collection_key}" and of type "${data.type}" under environment "${data.environment_key}" not found`,
            status: 404,
        });
    }
    const collectionBricks = index_js_1.default.getAllAllowedBricks({
        collection,
        environment,
    });
    collection["bricks"] = collectionBricks.collectionBricks;
    return collection;
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map