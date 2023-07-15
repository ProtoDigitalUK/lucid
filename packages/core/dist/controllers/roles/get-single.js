"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const service_1 = __importDefault(require("../../utils/app/service"));
const roles_1 = __importDefault(require("../../schemas/roles"));
const roles_2 = __importDefault(require("../../services/roles"));
const getSingleController = async (req, res, next) => {
    try {
        const role = await (0, service_1.default)(roles_2.default.getSingle, false)({
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