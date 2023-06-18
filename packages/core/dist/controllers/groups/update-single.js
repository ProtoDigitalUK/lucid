"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const Group_1 = __importDefault(require("../../db/models/Group"));
const groups_1 = __importDefault(require("../../schemas/groups"));
const updateSingle = async (req, res, next) => {
    try {
        const group = await Group_1.default.updateSingle(req.auth.id, req.headers["lucid-environment"], req.params.collection_key, req.body.bricks);
        res.status(200).json((0, build_response_1.default)(req, {
            data: group,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: groups_1.default.updateSingle,
    controller: updateSingle,
};
//# sourceMappingURL=update-single.js.map