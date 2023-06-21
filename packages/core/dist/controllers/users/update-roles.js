"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const UserRole_1 = __importDefault(require("../../db/models/UserRole"));
const users_1 = __importDefault(require("../../schemas/users"));
const updateRoles = async (req, res, next) => {
    try {
        const userRoles = await UserRole_1.default.update(req.params.id, {
            role_ids: req.body.role_ids,
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: userRoles,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: users_1.default.updateRoles,
    controller: updateRoles,
};
//# sourceMappingURL=update-roles.js.map