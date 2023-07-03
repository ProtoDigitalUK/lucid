"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const send_email_1 = __importDefault(require("../../services/emails/send-email"));
const health_1 = __importDefault(require("../../schemas/health"));
const tempSend = async (req, res, next) => {
    try {
        const status = await (0, send_email_1.default)("forgot-password", {
            data: {
                name: "William Yallop",
            },
            options: {
                to: "wyallop14@gmail.com  ",
                subject: "Forgot Password",
            },
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: {
                success: status.success,
                message: status.message,
            },
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: health_1.default.getHealth,
    controller: tempSend,
};
//# sourceMappingURL=temp-send.js.map