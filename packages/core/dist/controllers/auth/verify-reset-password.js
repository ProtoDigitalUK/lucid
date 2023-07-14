"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const auth_1 = __importDefault(require("../../schemas/auth"));
const auth_2 = __importDefault(require("../../services/auth"));
const verifyResetPasswordController = async (req, res, next) => {
    try {
        const verifyResetPassword = await auth_2.default.verifyResetPassword({
            token: req.params.token,
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: verifyResetPassword,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: auth_1.default.verifyResetPassword,
    controller: verifyResetPasswordController,
};
//# sourceMappingURL=verify-reset-password.js.map