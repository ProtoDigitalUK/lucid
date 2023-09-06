import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import rolesSchema from "../../schemas/roles.js";
import rolesService from "../../services/roles/index.js";
const deleteSingleController = async (req, res, next) => {
    try {
        const role = await service(rolesService.deleteSingle, true)({
            id: parseInt(req.params.id),
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
    schema: rolesSchema.deleteSingle,
    controller: deleteSingleController,
};
//# sourceMappingURL=delete-single.js.map