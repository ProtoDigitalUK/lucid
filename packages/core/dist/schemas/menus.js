"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItem = void 0;
const zod_1 = __importDefault(require("zod"));
const BaseMenuItemSchema = zod_1.default.object({
    id: zod_1.default.number().optional(),
    url: zod_1.default.string().optional(),
    page_id: zod_1.default.number().optional(),
    name: zod_1.default.string().nonempty(),
    target: zod_1.default.enum(["_self", "_blank", "_parent", "_top"]).optional(),
    meta: zod_1.default.any().optional(),
});
const BaseMenuItemSchemaUpdate = zod_1.default.object({
    id: zod_1.default.number().optional(),
    url: zod_1.default.string().optional(),
    page_id: zod_1.default.number().optional(),
    name: zod_1.default.string().optional(),
    target: zod_1.default.enum(["_self", "_blank", "_parent", "_top"]).optional(),
    meta: zod_1.default.any().optional(),
});
exports.MenuItem = BaseMenuItemSchema.extend({
    children: zod_1.default.lazy(() => exports.MenuItem.array().optional()),
});
const MenuItemUpdate = BaseMenuItemSchemaUpdate.extend({
    children: zod_1.default.lazy(() => exports.MenuItem.array().optional()),
});
const createSingleBody = zod_1.default.object({
    key: zod_1.default.string().nonempty(),
    name: zod_1.default.string().nonempty(),
    description: zod_1.default.string().optional(),
    items: zod_1.default.array(exports.MenuItem).optional(),
});
const createSingleQuery = zod_1.default.object({});
const createSingleParams = zod_1.default.object({});
const deleteSingleBody = zod_1.default.object({});
const deleteSingleQuery = zod_1.default.object({});
const deleteSingleParams = zod_1.default.object({
    id: zod_1.default.string(),
});
const getSingleBody = zod_1.default.object({});
const getSingleQuery = zod_1.default.object({});
const getSingleParams = zod_1.default.object({
    id: zod_1.default.string(),
});
const getMultipleBody = zod_1.default.object({});
const getMultipleQuery = zod_1.default.object({
    filter: zod_1.default
        .object({
        name: zod_1.default.string().optional(),
    })
        .optional(),
    sort: zod_1.default
        .array(zod_1.default.object({
        key: zod_1.default.enum(["created_at"]),
        value: zod_1.default.enum(["asc", "desc"]),
    }))
        .optional(),
    include: zod_1.default.array(zod_1.default.enum(["items"])).optional(),
    page: zod_1.default.string().optional(),
    per_page: zod_1.default.string().optional(),
});
const getMultipleParams = zod_1.default.object({});
const updateSingleBody = zod_1.default.object({
    key: zod_1.default.string().optional(),
    name: zod_1.default.string().optional(),
    description: zod_1.default.string().optional(),
    items: zod_1.default.array(MenuItemUpdate).optional(),
});
const updateSingleQuery = zod_1.default.object({});
const updateSingleParams = zod_1.default.object({
    id: zod_1.default.string(),
});
exports.default = {
    createSingle: {
        body: createSingleBody,
        query: createSingleQuery,
        params: createSingleParams,
    },
    deleteSingle: {
        body: deleteSingleBody,
        query: deleteSingleQuery,
        params: deleteSingleParams,
    },
    getSingle: {
        body: getSingleBody,
        query: getSingleQuery,
        params: getSingleParams,
    },
    getMultiple: {
        body: getMultipleBody,
        query: getMultipleQuery,
        params: getMultipleParams,
    },
    updateSingle: {
        body: updateSingleBody,
        query: updateSingleQuery,
        params: updateSingleParams,
    },
};
//# sourceMappingURL=menus.js.map