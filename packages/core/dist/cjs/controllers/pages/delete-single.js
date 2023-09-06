"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_js_1 = __importDefault(require("../../utils/app/build-response.js"));
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const pages_js_1 = __importDefault(require("../../schemas/pages.js"));
const index_js_1 = __importDefault(require("../../services/pages/index.js"));
const deleteSingleController = async (req, res, next) => {
    try {
        const page = await (0, service_js_1.default)(index_js_1.default.deleteSingle, true)({
            id: parseInt(req.params.id),
            environment_key: req.headers["lucid-environment"],
        });
        res.status(200).json((0, build_response_js_1.default)(req, {
            data: page,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: pages_js_1.default.deleteSingle,
    controller: deleteSingleController,
};
//# sourceMappingURL=delete-single.js.map