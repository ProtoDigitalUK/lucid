"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const service_1 = __importDefault(require("../../utils/app/service"));
const users_1 = __importDefault(require("../../schemas/users"));
const users_2 = __importDefault(require("../../services/users"));
const updateSingleController = async (req, res, next) => {
    try {
        const userRoles = await (0, service_1.default)(users_2.default.updateSingle, true)({
            user_id: parseInt(req.params.id),
            role_ids: req.body.role_ids,
            super_admin: req.body.super_admin,
        }, req.auth.id);
        res.status(200).json((0, build_response_1.default)(req, {
            data: userRoles,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: users_1.default.updateSingle,
    controller: updateSingleController,
};
//# sourceMappingURL=update-single.js.map