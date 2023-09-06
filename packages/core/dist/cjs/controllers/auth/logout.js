"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_js_1 = __importDefault(require("../../utils/app/build-response.js"));
const auth_js_1 = __importDefault(require("../../schemas/auth.js"));
const index_js_1 = __importDefault(require("../../services/auth/index.js"));
const logout = async (req, res, next) => {
    try {
        index_js_1.default.jwt.clearJWT(res);
        index_js_1.default.csrf.clearCSRFToken(res);
        res.status(200).json((0, build_response_js_1.default)(req, {
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
    schema: auth_js_1.default.logout,
    controller: logout,
};
//# sourceMappingURL=logout.js.map