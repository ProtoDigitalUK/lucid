"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_js_1 = __importDefault(require("../../utils/app/build-response.js"));
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const users_js_1 = __importDefault(require("../../schemas/users.js"));
const index_js_1 = __importDefault(require("../../services/users/index.js"));
const getSingleController = async (req, res, next) => {
    try {
        const user = await (0, service_js_1.default)(index_js_1.default.getSingle, false)({
            user_id: parseInt(req.params.id),
        });
        res.status(200).json((0, build_response_js_1.default)(req, {
            data: user,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: users_js_1.default.getSingle,
    controller: getSingleController,
};
//# sourceMappingURL=get-single.js.map