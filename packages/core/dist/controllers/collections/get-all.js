"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const service_1 = __importDefault(require("../../utils/app/service"));
const collections_1 = __importDefault(require("../../schemas/collections"));
const collections_2 = __importDefault(require("../../services/collections"));
const getAllController = async (req, res, next) => {
    try {
        const collectionsRes = await (0, service_1.default)(collections_2.default.getAll, false)({
            query: req.query,
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: collectionsRes,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: collections_1.default.getAll,
    controller: getAllController,
};
//# sourceMappingURL=get-all.js.map