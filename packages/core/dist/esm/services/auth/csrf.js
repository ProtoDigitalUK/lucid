import crypto from "crypto";
import Config from "../Config.js";
export const generateCSRFToken = (res) => {
    const token = crypto.randomBytes(32).toString("hex");
    res.cookie("_csrf", token, {
        maxAge: 86400000 * 7,
        httpOnly: true,
        secure: Config.mode === "production",
        sameSite: "strict",
    });
    return token;
};
export const verifyCSRFToken = (req) => {
    const { _csrf } = req.cookies;
    const { _csrf: CSRFHeader } = req.headers;
    if (!_csrf || !CSRFHeader)
        return false;
    if (_csrf !== CSRFHeader)
        return false;
    return true;
};
export const clearCSRFToken = (res) => {
    res.clearCookie("_csrf");
};
export default {
    generateCSRFToken,
    verifyCSRFToken,
    clearCSRFToken,
};
//# sourceMappingURL=csrf.js.map