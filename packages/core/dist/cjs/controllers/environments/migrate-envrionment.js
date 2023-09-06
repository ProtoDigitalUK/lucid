"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_js_1 = __importDefault(require("../../utils/app/build-response.js"));
const environments_js_1 = __importDefault(require("../../schemas/environments.js"));
const index_js_1 = __importDefault(require("../../services/environments/index.js"));
const migrateEnvironmentController = async (req, res, next) => {
    try {
        await index_js_1.default.migrateEnvironment({});
        res.status(200).json((0, build_response_js_1.default)(req, {
            data: {
                message: "Environment migrated successfully",
            },
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: environments_js_1.default.migrateEnvironment,
    controller: migrateEnvironmentController,
};
//# sourceMappingURL=migrate-envrionment.js.map