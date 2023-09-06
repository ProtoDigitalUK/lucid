import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import rolesSchema from "../../schemas/roles.js";
import rolesService from "../../services/roles/index.js";
const createSingleController = async (req, res, next) => {
    try {
        const role = await service(rolesService.createSingle, true)({
            name: req.body.name,
            permission_groups: req.body.permission_groups,
        });
        res.status(200).json(buildResponse(req, {
            data: role,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: rolesSchema.createSingle,
    controller: createSingleController,
};
//# sourceMappingURL=create-single.js.map