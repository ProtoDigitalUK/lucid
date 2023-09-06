import jwt from "jsonwebtoken";
import Config from "../Config.js";
export const generateJWT = (res, user) => {
    const { id, email, username } = user;
    const payload = {
        id,
        email,
        username,
    };
    const token = jwt.sign(payload, Config.secret, {
        expiresIn: "7d",
    });
    res.cookie("_jwt", token, {
        maxAge: 86400000 * 7,
        httpOnly: true,
        secure: Config.mode === "production",
        sameSite: "strict",
    });
    res.cookie("auth", true, {
        maxAge: 86400000 * 7,
    });
};
export const verifyJWT = (req) => {
    try {
        const { _jwt } = req.cookies;
        if (!_jwt) {
            return {
                sucess: false,
                data: null,
            };
        }
        const decoded = jwt.verify(_jwt, Config.secret);
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
export const clearJWT = (res) => {
    res.clearCookie("_jwt");
    res.clearCookie("auth");
};
export default {
    generateJWT,
    verifyJWT,
    clearJWT,
};
//# sourceMappingURL=jwt.js.map