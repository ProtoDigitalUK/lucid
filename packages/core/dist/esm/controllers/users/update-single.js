import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import usersSchema from "../../schemas/users.js";
import usersService from "../../services/users/index.js";
const updateSingleController = async (req, res, next) => {
    try {
        const userRoles = await service(usersService.updateSingle, true)({
            user_id: parseInt(req.params.id),
            role_ids: req.body.role_ids,
            super_admin: req.body.super_admin,
        }, req.auth.id);
        res.status(200).json(buildResponse(req, {
            data: userRoles,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: usersSchema.updateSingle,
    controller: updateSingleController,
};
//# sourceMappingURL=update-single.js.map