"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const permissions = (permissions) => async (req, res, next) => {
    try {
        const environment = req.headers["lucid-environment"];
        return next();
    }
    catch (error) {
        return next(error);
    }
};
exports.default = permissions;
//# sourceMappingURL=permissions.js.map