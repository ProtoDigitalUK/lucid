"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_js_1 = __importDefault(require("../../utils/app/build-response.js"));
const auth_js_1 = __importDefault(require("../../schemas/auth.js"));
const index_js_1 = __importDefault(require("../../services/auth/index.js"));
const getCSRFController = async (req, res, next) => {
    try {
        const token = index_js_1.default.csrf.generateCSRFToken(res);
        res.status(200).json((0, build_response_js_1.default)(req, {
            data: {
                _csrf: token,
            },
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: auth_js_1.default.getCSRF,
    controller: getCSRFController,
};
//# sourceMappingURL=get-csrf.js.map