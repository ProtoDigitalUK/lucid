"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/controllers/build-response"));
const auth_1 = __importDefault(require("../../schemas/auth"));
const jwt_1 = require("../../services/auth/jwt");
const login_1 = __importDefault(require("../../services/auth/login"));
const loginController = async (req, res, next) => {
    try {
        const user = await (0, login_1.default)({
            username: req.body.username,
            password: req.body.password,
        });
        (0, jwt_1.generateJWT)(res, user);
        res.status(200).json((0, build_response_1.default)(req, { data: user }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: auth_1.default.login,
    controller: loginController,
};
//# sourceMappingURL=login.js.map