"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_js_1 = __importDefault(require("../../utils/app/build-response.js"));
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const account_js_1 = __importDefault(require("../../schemas/account.js"));
const index_js_1 = __importDefault(require("../../services/users/index.js"));
const updateMeController = async (req, res, next) => {
    try {
        const userRoles = await (0, service_js_1.default)(index_js_1.default.updateSingle, true)({
            user_id: req.auth.id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            email: req.body.email,
            role_ids: req.body.role_ids,
        }, req.auth.id);
        res.status(200).json((0, build_response_js_1.default)(req, {
            data: userRoles,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: account_js_1.default.updateMe,
    controller: updateMeController,
};
//# sourceMappingURL=update-me.js.map