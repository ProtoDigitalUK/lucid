import { LucidError } from "../utils/app/error-handler.js";
import service from "../utils/app/service.js";
import usersServices from "../services/users/index.js";
const throwPermissionError = () => {
    throw new LucidError({
        type: "basic",
        name: "Permission Error",
        message: "You do not have permission to access this resource",
        status: 403,
    });
};
const permissions = (permissions) => async (req, res, next) => {
    try {
        const environment = req.headers["lucid-environment"];
        const user = await service(usersServices.getSingle, false)({
            user_id: req.auth.id,
        });
        if (user.super_admin)
            return next();
        if (user.permissions === undefined)
            throwPermissionError();
        if (permissions.global) {
            permissions.global.forEach((permission) => {
                if (!user.permissions?.global.includes(permission))
                    throwPermissionError();
            });
        }
        if (permissions.environments) {
            if (!environment)
                throwPermissionError();
            const environmentPermissions = user.permissions?.environments?.find((env) => env.key === environment);
            if (!environmentPermissions)
                throwPermissionError();
            permissions.environments.forEach((permission) => {
                if (!environmentPermissions?.permissions.includes(permission))
                    throwPermissionError();
            });
        }
        return next();
    }
    catch (error) {
        return next(error);
    }
};
export default permissions;
//# sourceMappingURL=permissions.js.map