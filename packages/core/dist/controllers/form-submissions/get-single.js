"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/controllers/build-response"));
const FormSubmission_1 = __importDefault(require("../../db/models/FormSubmission"));
const form_submissions_1 = __importDefault(require("../../schemas/form-submissions"));
const getSingle = async (req, res, next) => {
    try {
        const formSubmission = await FormSubmission_1.default.getSingle({
            id: parseInt(req.params.id),
            form_key: req.params.form_key,
            environment_key: req.headers["lucid-environment"],
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: formSubmission,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: form_submissions_1.default.getSingle,
    controller: getSingle,
};
//# sourceMappingURL=get-single.js.map