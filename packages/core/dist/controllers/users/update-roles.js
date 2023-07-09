"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/controllers/build-response"));
const users_1 = __importDefault(require("../../schemas/users"));
const users_2 = __importDefault(require("../../services/users"));
const updateRolesController = async (req, res, next) => {
    try {
        const userRoles = await users_2.default.updateRoles({
            user_id: parseInt(req.params.id),
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
    controller: updateRolesController,
};
//# sourceMappingURL=update-roles.js.map