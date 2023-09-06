"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_js_1 = __importDefault(require("../../utils/app/build-response.js"));
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const menus_js_1 = __importDefault(require("../../schemas/menus.js"));
const index_js_1 = __importDefault(require("../../services/menu/index.js"));
const updateSingleController = async (req, res, next) => {
    try {
        const menu = await (0, service_js_1.default)(index_js_1.default.updateSingle, true)({
            environment_key: req.headers["lucid-environment"],
            id: parseInt(req.params.id),
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
    schema: menus_js_1.default.updateSingle,
    controller: updateSingleController,
};
//# sourceMappingURL=update-single.js.map