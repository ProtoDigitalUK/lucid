"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const auth_1 = __importDefault(require("../../schemas/auth"));
const auth_2 = __importDefault(require("../../services/auth"));
const resetPasswordController = async (req, res, next) => {
    try {
        const resetPassword = await auth_2.default.resetPassword({
            token: req.params.token,
            password: req.body.password,
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: resetPassword,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: auth_1.default.resetPassword,
    controller: resetPasswordController,
};
//# sourceMappingURL=reset-password.js.map