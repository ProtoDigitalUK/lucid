"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const environments_1 = __importDefault(require("../../schemas/environments"));
const migrateEnvironment = async (req, res, next) => {
    try {
        res.status(200).json((0, build_response_1.default)(req, {
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
    schema: environments_1.default.migrateEnvironment,
    controller: migrateEnvironment,
};
//# sourceMappingURL=migrate-envrionment.js.map