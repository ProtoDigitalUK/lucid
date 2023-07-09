"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/controllers/build-response"));
const menus_1 = __importDefault(require("../../schemas/menus"));
const menu_1 = __importDefault(require("../../services/menu"));
const getMultipleController = async (req, res, next) => {
    try {
        const menusRes = await menu_1.default.getMultiple({
            query: req.query,
            environment_key: req.headers["lucid-environment"],
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: menusRes.data,
            pagination: {
                count: menusRes.count,
                page: req.query.page,
                per_page: req.query.per_page,
            },
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: menus_1.default.getMultiple,
    controller: getMultipleController,
};
//# sourceMappingURL=get-multiple.js.map