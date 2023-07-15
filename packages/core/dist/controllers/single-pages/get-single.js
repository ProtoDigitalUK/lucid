"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const service_1 = __importDefault(require("../../utils/app/service"));
const single_page_1 = __importDefault(require("../../schemas/single-page"));
const single_pages_1 = __importDefault(require("../../services/single-pages"));
const getSingleController = async (req, res, next) => {
    try {
        const singlepage = await (0, service_1.default)(single_pages_1.default.getSingle, true)({
            user_id: req.auth.id,
            environment_key: req.headers["lucid-environment"],
            collection_key: req.params.collection_key,
            include_bricks: true,
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: singlepage,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: single_page_1.default.getSingle,
    controller: getSingleController,
};
//# sourceMappingURL=get-single.js.map