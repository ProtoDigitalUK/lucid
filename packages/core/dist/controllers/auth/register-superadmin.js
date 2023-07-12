"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const auth_1 = __importDefault(require("../../schemas/auth"));
const users_1 = __importDefault(require("../../services/users"));
const registerSuperAdminController = async (req, res, next) => {
    try {
        const user = await users_1.default.registerSuperAdmin({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: user,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: auth_1.default.registerSuperAdmin,
    controller: registerSuperAdminController,
};
//# sourceMappingURL=register-superadmin.js.map