"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const service_1 = __importDefault(require("../../utils/app/service"));
const menus_1 = __importDefault(require("../../schemas/menus"));
const menu_1 = __importDefault(require("../../services/menu"));
const updateSingleController = async (req, res, next) => {
    try {
        const menu = await (0, service_1.default)(menu_1.default.updateSingle, true)({
            environment_key: req.headers["lucid-environment"],
            id: parseInt(req.params.id),
            key: req.body.key,
            name: req.body.name,
            description: req.body.description,
            items: req.body.items,
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: menu,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: menus_1.default.updateSingle,
    controller: updateSingleController,
};
//# sourceMappingURL=update-single.js.map