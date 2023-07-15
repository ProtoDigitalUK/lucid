"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const service_1 = __importDefault(require("../../utils/app/service"));
const auth_1 = __importDefault(require("../../schemas/auth"));
const users_1 = __importDefault(require("../../services/users"));
const auth_2 = __importDefault(require("../../services/auth"));
const registerSuperAdminController = async (req, res, next) => {
    try {
        const user = await (0, service_1.default)(users_1.default.registerSuperAdmin, true)({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
        });
        auth_2.default.jwt.generateJWT(res, user);
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