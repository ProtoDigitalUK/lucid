"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const service_1 = __importDefault(require("../../utils/app/service"));
const email_1 = __importDefault(require("../../schemas/email"));
const email_2 = __importDefault(require("../../services/email"));
const getSingleController = async (req, res, next) => {
    try {
        const email = await (0, service_1.default)(email_2.default.getSingle, false)({
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
    schema: email_1.default.getSingle,
    controller: getSingleController,
};
//# sourceMappingURL=get-single.js.map