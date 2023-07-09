"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/controllers/build-response"));
const Environment_1 = __importDefault(require("../../db/models/Environment"));
const environments_1 = __importDefault(require("../../schemas/environments"));
const createSingle = async (req, res, next) => {
    try {
        const environment = await Environment_1.default.upsertSingle({
            key: req.body.key,
            title: req.body.title,
            assigned_bricks: req.body.assigned_bricks,
            assigned_collections: req.body.assigned_collections,
            assigned_forms: req.body.assigned_forms,
        }, true);
        res.status(200).json((0, build_response_1.default)(req, {
            data: environment,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: environments_1.default.createSingle,
    controller: createSingle,
};
//# sourceMappingURL=create-single.js.map