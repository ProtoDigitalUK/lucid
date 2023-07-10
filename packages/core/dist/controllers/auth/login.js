"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const auth_1 = __importDefault(require("../../schemas/auth"));
const auth_2 = __importDefault(require("../../services/auth"));
const loginController = async (req, res, next) => {
    try {
        const user = await auth_2.default.login({
            username: req.body.username,
            password: req.body.password,
        });
        auth_2.default.jwt.generateJWT(res, user);
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