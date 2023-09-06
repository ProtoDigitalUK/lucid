"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const Config_js_1 = __importDefault(require("../services/Config.js"));
const fileUpload = async (req, res, next) => {
    const options = {
        debug: Config_js_1.default.mode === "development",
    };
    (0, express_fileupload_1.default)(options)(req, res, next);
};
exports.default = fileUpload;
//# sourceMappingURL=file-upload.js.map