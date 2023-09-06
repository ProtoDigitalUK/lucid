import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import usersSchema from "../../schemas/users.js";
import usersService from "../../services/users/index.js";
const getSingleController = async (req, res, next) => {
    try {
        const user = await service(usersService.getSingle, false)({
            user_id: parseInt(req.params.id),
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
    schema: usersSchema.getSingle,
    controller: getSingleController,
};
//# sourceMappingURL=get-single.js.map