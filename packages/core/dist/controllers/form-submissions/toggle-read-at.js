"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const service_1 = __importDefault(require("../../utils/app/service"));
const form_submissions_1 = __importDefault(require("../../schemas/form-submissions"));
const form_submissions_2 = __importDefault(require("../../services/form-submissions"));
const toggleReadAtController = async (req, res, next) => {
    try {
        const formSubmission = await (0, service_1.default)(form_submissions_2.default.toggleReadAt, true)({
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
    controller: toggleReadAtController,
};
//# sourceMappingURL=toggle-read-at.js.map