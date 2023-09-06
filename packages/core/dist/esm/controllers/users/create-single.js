import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import usersSchema from "../../schemas/users.js";
import usersService from "../../services/users/index.js";
const createSingleController = async (req, res, next) => {
    try {
        const user = await service(usersService.registerSingle, true)({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            super_admin: req.body.super_admin,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            role_ids: req.body.role_ids,
        }, req.auth.id);
        res.status(200).json(buildResponse(req, {
            data: user,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: usersSchema.createSingle,
    controller: createSingleController,
};
//# sourceMappingURL=create-single.js.map