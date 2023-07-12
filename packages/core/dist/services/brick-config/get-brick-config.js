"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../Config"));
const getBrickConfig = () => {
    const brickInstances = Config_1.default.bricks;
    if (!brickInstances) {
        return [];
    }
    else {
        return brickInstances;
    }
};
exports.default = getBrickConfig;
//# sourceMappingURL=get-brick-config.js.map