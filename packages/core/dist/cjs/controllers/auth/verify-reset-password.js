"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_js_1 = __importDefault(require("../../utils/app/build-response.js"));
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const auth_js_1 = __importDefault(require("../../schemas/auth.js"));
const index_js_1 = __importDefault(require("../../services/auth/index.js"));
const verifyResetPasswordController = async (req, res, next) => {
    try {
        const verifyResetPassword = await (0, service_js_1.default)(index_js_1.default.verifyResetPassword, false)({
            token: req.params.token,
        });
        res.status(200).json((0, build_response_js_1.default)(req, {
            data: verifyResetPassword,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: auth_js_1.default.verifyResetPassword,
    controller: verifyResetPasswordController,
};
//# sourceMappingURL=verify-reset-password.js.map