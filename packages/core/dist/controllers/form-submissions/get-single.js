"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const form_submissions_1 = __importDefault(require("../../schemas/form-submissions"));
const form_submissions_2 = __importDefault(require("../../services/form-submissions"));
const getSingleController = async (req, res, next) => {
    try {
        const formSubmission = await form_submissions_2.default.getSingle({
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
    controller: getSingleController,
};
//# sourceMappingURL=get-single.js.map