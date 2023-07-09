"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/controllers/build-response"));
const roles_1 = __importDefault(require("../../schemas/roles"));
const roles_2 = __importDefault(require("../../services/roles"));
const getSingleController = async (req, res, next) => {
    try {
        const role = await roles_2.default.getSingle({
            id: parseInt(req.params.id),
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
    schema: roles_1.default.getSingle,
    controller: getSingleController,
};
//# sourceMappingURL=get-single.js.map