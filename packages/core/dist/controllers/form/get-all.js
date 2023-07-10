"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const forms_1 = __importDefault(require("../../schemas/forms"));
const form_1 = __importDefault(require("../../services/form"));
const getAllController = async (req, res, next) => {
    try {
        const formsRes = await form_1.default.getAll({
            query: req.query,
            environment_key: req.headers["lucid-environment"],
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: formsRes,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: forms_1.default.getAll,
    controller: getAllController,
};
//# sourceMappingURL=get-all.js.map