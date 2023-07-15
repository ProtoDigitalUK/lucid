"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../utils/app/error-handler");
const service_1 = __importDefault(require("../utils/app/service"));
const environments_1 = __importDefault(require("../services/environments"));
const validateEnvironment = async (req, res, next) => {
    try {
        const environment = req.headers["lucid-environment"];
        if (!environment) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Validation Error",
                message: "You must set the Lucid Environment header.",
                status: 400,
                errors: (0, error_handler_1.modelErrors)({
                    "lucid-environment": {
                        code: "required",
                        message: "You must set the Lucid Environment header.",
                    },
                }),
            });
        }
        const environmentConfig = await (0, service_1.default)(environments_1.default.getAll, false)();
        const findEnv = environmentConfig.find((env) => env.key === environment);
        if (!findEnv) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Validation Error",
                message: "You must set a valid Lucid Environment header.",
                status: 400,
                errors: (0, error_handler_1.modelErrors)({
                    "lucid-environment": {
                        code: "required",
                        message: "You must set a valid Lucid Environment header.",
                    },
                }),
            });
        }
        return next();
    }
    catch (error) {
        return next(error);
    }
};
exports.default = validateEnvironment;
//# sourceMappingURL=validate-environment.js.map