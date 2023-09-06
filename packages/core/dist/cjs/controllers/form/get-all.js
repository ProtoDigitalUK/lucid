"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_js_1 = __importDefault(require("../../utils/app/build-response.js"));
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const forms_js_1 = __importDefault(require("../../schemas/forms.js"));
const index_js_1 = __importDefault(require("../../services/forms/index.js"));
const getAllController = async (req, res, next) => {
    try {
        const formsRes = await (0, service_js_1.default)(index_js_1.default.getAll, false)({
            query: req.query,
        });
        res.status(200).json((0, build_response_js_1.default)(req, {
            data: formsRes,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: forms_js_1.default.getAll,
    controller: getAllController,
};
//# sourceMappingURL=get-all.js.map