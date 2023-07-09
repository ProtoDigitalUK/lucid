"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/controllers/build-response"));
const Email_1 = __importDefault(require("../../db/models/Email"));
const email_1 = __importDefault(require("../../schemas/email"));
const getSingle = async (req, res, next) => {
    try {
        const email = await Email_1.default.getSingle(parseInt(req.params.id));
        res.status(200).json((0, build_response_1.default)(req, {
            data: email,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: email_1.default.getSingle,
    controller: getSingle,
};
//# sourceMappingURL=get-single.js.map