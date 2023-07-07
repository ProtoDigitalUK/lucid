"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const FormSubmission_1 = __importDefault(require("../../db/models/FormSubmission"));
const form_submissions_1 = __importDefault(require("../../schemas/form-submissions"));
const getMultiple = async (req, res, next) => {
    try {
        const submissions = await FormSubmission_1.default.getMultiple(req.query, {
            form_key: req.params.form_key,
            environment_key: req.headers["lucid-environment"],
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: submissions.data,
            pagination: {
                count: submissions.count,
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
    schema: form_submissions_1.default.getMultiple,
    controller: getMultiple,
};
//# sourceMappingURL=get-multiple.js.map