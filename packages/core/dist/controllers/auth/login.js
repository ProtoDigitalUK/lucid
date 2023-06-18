"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const jwt_1 = require("../../services/auth/jwt");
const User_1 = __importDefault(require("../../db/models/User"));
const auth_1 = __importDefault(require("../../schemas/auth"));
const login = async (req, res, next) => {
    try {
        const user = await User_1.default.login({
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
    controller: login,
};
//# sourceMappingURL=login.js.map