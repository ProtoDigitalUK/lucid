"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_helpers_1 = require("../../utils/app/query-helpers");
const service_1 = __importDefault(require("../../utils/app/service"));
const SinglePage_1 = __importDefault(require("../../db/models/SinglePage"));
const collections_1 = __importDefault(require("../collections"));
const collection_bricks_1 = __importDefault(require("../collection-bricks"));
const getSingle = async (client, data) => {
    const collection = await (0, service_1.default)(collections_1.default.getSingle, false, client)({
        collection_key: data.collection_key,
        environment_key: data.environment_key,
        type: "singlepage",
    });
    const SelectQuery = new query_helpers_1.SelectQueryBuilder({
        columns: [
            "id",
            "environment_key",
            "collection_key",
            "created_at",
            "updated_at",
            "updated_by",
        ],
        exclude: undefined,
        filter: {
            data: {
                collection_key: data.collection_key,
                environment_key: data.environment_key,
            },
            meta: {
                collection_key: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
                environment_key: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
            },
        },
        sort: undefined,
        page: undefined,
        per_page: undefined,
    });
    let singlepage = await SinglePage_1.default.getSingle(client, SelectQuery);
    if (!singlepage) {
        singlepage = await SinglePage_1.default.createSingle(client, {
            user_id: data.user_id,
            environment_key: data.environment_key,
            collection_key: data.collection_key,
            builder_bricks: [],
            fixed_bricks: [],
        });
    }
    if (data.include_bricks) {
        const pageBricks = await (0, service_1.default)(collection_bricks_1.default.getAll, false, client)({
            reference_id: singlepage.id,
            type: "singlepage",
            environment_key: data.environment_key,
            collection: collection,
        });
        singlepage.builder_bricks = pageBricks.builder_bricks;
        singlepage.fixed_bricks = pageBricks.fixed_bricks;
    }
    return singlepage;
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map