import buildResponse from "../../utils/app/build-response.js";
import Permissions from "../../services/Permissions.js";
import permissionsSchema from "../../schemas/permissions.js";
import formatPermissions from "../../utils/format/format-permissions.js";
const getAllController = async (req, res, next) => {
    try {
        const permissionsRes = formatPermissions(Permissions.raw);
        res.status(200).json(buildResponse(req, {
            data: permissionsRes,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: permissionsSchema.getAll,
    controller: getAllController,
};
//# sourceMappingURL=get-all.js.map