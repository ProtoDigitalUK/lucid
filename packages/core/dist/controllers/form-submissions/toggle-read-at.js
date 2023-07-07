"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const FormSubmission_1 = __importDefault(require("../../db/models/FormSubmission"));
const form_submissions_1 = __importDefault(require("../../schemas/form-submissions"));
const toggleReadAt = async (req, res, next) => {
    try {
        const formSubmission = await FormSubmission_1.default.toggleReadAt({
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
    schema: form_submissions_1.default.toggleReadAt,
    controller: toggleReadAt,
};
//# sourceMappingURL=toggle-read-at.js.map