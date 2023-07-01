"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const Menu_1 = __importDefault(require("../../db/models/Menu"));
const menus_1 = __importDefault(require("../../schemas/menus"));
const getSingle = async (req, res, next) => {
    try {
        const menu = await Menu_1.default.getSingle({
            environment_key: req.headers["lucid-environment"],
            id: parseInt(req.params.id),
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
    schema: menus_1.default.getSingle,
    controller: getSingle,
};
//# sourceMappingURL=get-single.js.map