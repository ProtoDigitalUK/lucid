"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_js_1 = __importDefault(require("../../utils/app/build-response.js"));
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const menus_js_1 = __importDefault(require("../../schemas/menus.js"));
const index_js_1 = __importDefault(require("../../services/menu/index.js"));
const createSingleController = async (req, res, next) => {
    try {
        const menu = await (0, service_js_1.default)(index_js_1.default.createSingle, true)({
            environment_key: req.headers["lucid-environment"],
            key: req.body.key,
            name: req.body.name,
            description: req.body.description,
            items: req.body.items,
        });
        res.status(200).json((0, build_response_js_1.default)(req, {
            data: menu,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: menus_js_1.default.createSingle,
    controller: createSingleController,
};
//# sourceMappingURL=create-single.js.map