"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __importDefault(require("../constants"));
const paginated = async (req, res, next) => {
    try {
        if (!req.query.page) {
            req.query.page = constants_1.default.pagination.page;
        }
        if (!req.query.per_page) {
            req.query.per_page = constants_1.default.pagination.per_page;
        }
        return next();
    }
    catch (error) {
        return next(error);
    }
};
exports.default = paginated;
//# sourceMappingURL=paginated.js.map