"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const users_1 = __importDefault(require("../../schemas/users"));
const users_2 = __importDefault(require("../../services/users"));
const createSingleController = async (req, res, next) => {
    try {
        const user = await users_2.default.registerSingle({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            super_admin: req.body.super_admin,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            role_ids: req.body.role_ids,
        }, req.auth.id);
        res.status(200).json((0, build_response_1.default)(req, {
            data: user,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: users_1.default.createSingle,
    controller: createSingleController,
};
//# sourceMappingURL=create-single.js.map