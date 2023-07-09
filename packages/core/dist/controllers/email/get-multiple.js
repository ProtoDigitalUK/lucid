"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/controllers/build-response"));
const email_1 = __importDefault(require("../../schemas/email"));
const email_2 = __importDefault(require("../../services/email"));
const getMultipleController = async (req, res, next) => {
    try {
        const emailsRes = await email_2.default.getMultiple({
            query: req.query,
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: emailsRes.data,
            pagination: {
                count: emailsRes.count,
                page: req.query.page,
                per_page: req.query.per_page,
            },
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: email_1.default.getMultiple,
    controller: getMultipleController,
};
//# sourceMappingURL=get-multiple.js.map