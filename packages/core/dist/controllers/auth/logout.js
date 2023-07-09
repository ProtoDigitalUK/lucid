"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/controllers/build-response"));
const auth_1 = __importDefault(require("../../schemas/auth"));
const auth_2 = __importDefault(require("../../services/auth"));
const logout = async (req, res, next) => {
    try {
        auth_2.default.jwt.clearJWT(res);
        auth_2.default.csrf.clearCSRFToken(res);
        res.status(200).json((0, build_response_1.default)(req, {
            data: {
                message: "Logged out successfully",
            },
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: auth_1.default.logout,
    controller: logout,
};
//# sourceMappingURL=logout.js.map