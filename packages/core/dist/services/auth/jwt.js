"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearJWT = exports.verifyJWT = exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Config_1 = __importDefault(require("../Config"));
const generateJWT = (res, user) => {
    const { id, email, username } = user;
    const payload = {
        id,
        email,
        username,
    };
    const token = jsonwebtoken_1.default.sign(payload, Config_1.default.secretKey, {
        expiresIn: "7d",
    });
    res.cookie("_jwt", token, {
        maxAge: 86400000 * 7,
        httpOnly: true,
        secure: Config_1.default.environment === "production",
        sameSite: "strict",
    });
};
exports.generateJWT = generateJWT;
const verifyJWT = (req) => {
    try {
        const { _jwt } = req.cookies;
        if (!_jwt) {
            return {
                sucess: false,
                data: null,
            };
        }
        const decoded = jsonwebtoken_1.default.verify(_jwt, Config_1.default.secretKey);
        return {
            sucess: true,
            data: decoded,
        };
    }
    catch (err) {
        return {
            sucess: false,
            data: null,
        };
    }
};
exports.verifyJWT = verifyJWT;
const clearJWT = (res) => {
    res.clearCookie("_jwt");
};
exports.clearJWT = clearJWT;
//# sourceMappingURL=jwt.js.map