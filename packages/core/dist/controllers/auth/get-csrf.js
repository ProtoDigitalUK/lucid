"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/controllers/build-response"));
const auth_1 = __importDefault(require("../../schemas/auth"));
const csrf_1 = require("../../services/auth/csrf");
const getCSRFController = async (req, res, next) => {
    try {
        const token = (0, csrf_1.generateCSRFToken)(res);
        res.status(200).json((0, build_response_1.default)(req, {
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
    schema: auth_1.default.getCSRF,
    controller: getCSRFController,
};
//# sourceMappingURL=get-csrf.js.map