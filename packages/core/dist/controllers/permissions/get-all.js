"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const Permissions_1 = __importDefault(require("../../services/Permissions"));
const permissions_1 = __importDefault(require("../../schemas/permissions"));
const format_permissions_1 = __importDefault(require("../../utils/format/format-permissions"));
const getAllController = async (req, res, next) => {
    try {
        const permissionsRes = (0, format_permissions_1.default)(Permissions_1.default.raw);
        res.status(200).json((0, build_response_1.default)(req, {
            data: permissionsRes,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: permissions_1.default.getAll,
    controller: getAllController,
};
//# sourceMappingURL=get-all.js.map