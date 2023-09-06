"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_js_1 = __importDefault(require("../../utils/app/build-response.js"));
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const environments_js_1 = __importDefault(require("../../schemas/environments.js"));
const index_js_1 = __importDefault(require("../../services/environments/index.js"));
const getAllController = async (req, res, next) => {
    try {
        const environmentsRes = await (0, service_js_1.default)(index_js_1.default.getAll, false)();
        res.status(200).json((0, build_response_js_1.default)(req, {
            data: environmentsRes,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: environments_js_1.default.getAll,
    controller: getAllController,
};
//# sourceMappingURL=get-all.js.map