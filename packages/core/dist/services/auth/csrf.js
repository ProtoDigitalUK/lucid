"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCSRFToken = exports.verifyCSRFToken = exports.generateCSRFToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const Config_1 = __importDefault(require("../Config"));
const generateCSRFToken = (res) => {
    const token = crypto_1.default.getRandomValues(new Uint8Array(32)).join("");
    res.cookie("_csrf", token, {
        maxAge: 86400000 * 7,
        httpOnly: true,
        secure: Config_1.default.mode === "production",
        sameSite: "strict",
    });
    return token;
};
exports.generateCSRFToken = generateCSRFToken;
const verifyCSRFToken = (req) => {
    const { _csrf } = req.cookies;
    const { _csrf: CSRFHeader } = req.headers;
    if (!_csrf || !CSRFHeader)
        return false;
    if (_csrf !== CSRFHeader)
        return false;
    return true;
};
exports.verifyCSRFToken = verifyCSRFToken;
const clearCSRFToken = (res) => {
    res.clearCookie("_csrf");
};
exports.clearCSRFToken = clearCSRFToken;
exports.default = {
    generateCSRFToken: exports.generateCSRFToken,
    verifyCSRFToken: exports.verifyCSRFToken,
    clearCSRFToken: exports.clearCSRFToken,
};
//# sourceMappingURL=csrf.js.map