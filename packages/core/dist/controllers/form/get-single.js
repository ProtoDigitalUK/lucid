"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const service_1 = __importDefault(require("../../utils/app/service"));
const forms_1 = __importDefault(require("../../schemas/forms"));
const forms_2 = __importDefault(require("../../services/forms"));
const getSingleController = async (req, res, next) => {
    try {
        const form = await (0, service_1.default)(forms_2.default.getSingle, false)({
            key: req.params.form_key,
            environment_key: req.headers["lucid-environment"],
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: form,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: forms_1.default.getSingle,
    controller: getSingleController,
};
//# sourceMappingURL=get-single.js.map