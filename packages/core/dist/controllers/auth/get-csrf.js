"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const build_response_1 = __importDefault(require("@services/controllers/build-response"));
const csrf_1 = require("@services/auth/csrf");
const body = zod_1.default.object({});
const query = zod_1.default.object({});
const params = zod_1.default.object({});
const getCSRF = async (req, res, next) => {
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
    schema: {
        body,
        query,
        params,
    },
    controller: getCSRF,
};
//# sourceMappingURL=get-csrf.js.map