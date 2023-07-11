"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const permissions_1 = __importDefault(require("../../schemas/permissions"));
const permissions_2 = __importDefault(require("../../services/permissions"));
const getAllController = async (req, res, next) => {
    try {
        const permissionsRes = permissions_2.default.formatted;
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