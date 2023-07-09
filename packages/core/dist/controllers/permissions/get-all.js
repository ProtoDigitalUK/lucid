"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/controllers/build-response"));
const RolePermission_1 = __importDefault(require("../../db/models/RolePermission"));
const permissions_1 = __importDefault(require("../../schemas/permissions"));
const getAll = async (req, res, next) => {
    try {
        res.status(200).json((0, build_response_1.default)(req, {
            data: RolePermission_1.default.getValidPermissions,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: permissions_1.default.getAll,
    controller: getAll,
};
//# sourceMappingURL=get-all.js.map