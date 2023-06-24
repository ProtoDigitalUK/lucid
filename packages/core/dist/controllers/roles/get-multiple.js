"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const Role_1 = __importDefault(require("../../db/models/Role"));
const roles_1 = __importDefault(require("../../schemas/roles"));
const getMultiple = async (req, res, next) => {
    try {
        const roles = await Role_1.default.getMultiple(req.query);
        res.status(200).json((0, build_response_1.default)(req, {
            data: roles.data,
            pagination: {
                count: roles.count,
                page: req.query.page,
                per_page: req.query.per_page,
            },
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: roles_1.default.getMultiple,
    controller: getMultiple,
};
//# sourceMappingURL=get-multiple.js.map