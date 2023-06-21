"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const Role_1 = __importDefault(require("../../db/models/Role"));
const roles_1 = __importDefault(require("../../schemas/roles"));
const createSingle = async (req, res, next) => {
    try {
        const role = await Role_1.default.createSingle({
            name: req.body.name,
            permission_groups: req.body.permission_groups,
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: role,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: roles_1.default.createSingle,
    controller: createSingle,
};
//# sourceMappingURL=create-single.js.map