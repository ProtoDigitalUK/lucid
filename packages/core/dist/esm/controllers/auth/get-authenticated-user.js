import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import authSchema from "../../schemas/auth.js";
import usersService from "../../services/users/index.js";
const getAuthenticatedUserController = async (req, res, next) => {
    try {
        const user = await service(usersService.getSingle, false)({
            user_id: req.auth.id,
        });
        res.status(200).json(buildResponse(req, {
            data: user,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: authSchema.getAuthenticatedUser,
    controller: getAuthenticatedUserController,
};
//# sourceMappingURL=get-authenticated-user.js.map