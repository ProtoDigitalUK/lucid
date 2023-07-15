"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const users_1 = __importDefault(require("../../schemas/users"));
const users_2 = __importDefault(require("../../services/users"));
const getMultipleController = async (req, res, next) => {
    try {
        const user = await users_2.default.getMultiple({
            query: req.query,
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: user.data,
            pagination: {
                count: user.count,
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
    schema: users_1.default.getMultiple,
    controller: getMultipleController,
};
//# sourceMappingURL=get-multiple.js.map