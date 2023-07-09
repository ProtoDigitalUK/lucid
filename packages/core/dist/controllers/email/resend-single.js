"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/controllers/build-response"));
const email_1 = __importDefault(require("../../schemas/email"));
const email_2 = __importDefault(require("../../services/email"));
const resendSingleController = async (req, res, next) => {
    try {
        const email = await email_2.default.resendSingle({
            id: parseInt(req.params.id),
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: email,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: email_1.default.resendSingle,
    controller: resendSingleController,
};
//# sourceMappingURL=resend-single.js.map