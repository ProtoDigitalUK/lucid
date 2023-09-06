"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_js_1 = __importDefault(require("../../utils/app/build-response.js"));
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const forms_js_1 = __importDefault(require("../../schemas/forms.js"));
const index_js_1 = __importDefault(require("../../services/forms/index.js"));
const getSingleController = async (req, res, next) => {
    try {
        const form = await (0, service_js_1.default)(index_js_1.default.getSingle, false)({
            key: req.params.form_key,
            environment_key: req.headers["lucid-environment"],
        });
        res.status(200).json((0, build_response_js_1.default)(req, {
            data: form,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: forms_js_1.default.getSingle,
    controller: getSingleController,
};
//# sourceMappingURL=get-single.js.map