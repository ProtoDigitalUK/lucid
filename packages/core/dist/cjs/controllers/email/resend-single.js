"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_js_1 = __importDefault(require("../../utils/app/build-response.js"));
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const email_js_1 = __importDefault(require("../../schemas/email.js"));
const index_js_1 = __importDefault(require("../../services/email/index.js"));
const resendSingleController = async (req, res, next) => {
    try {
        const email = await (0, service_js_1.default)(index_js_1.default.resendSingle, true)({
            id: parseInt(req.params.id),
        });
        res.status(200).json((0, build_response_js_1.default)(req, {
            data: email,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: email_js_1.default.resendSingle,
    controller: resendSingleController,
};
//# sourceMappingURL=resend-single.js.map