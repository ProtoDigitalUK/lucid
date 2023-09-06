import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import usersSchema from "../../schemas/users.js";
import usersService from "../../services/users/index.js";
const getMultipleController = async (req, res, next) => {
    try {
        const user = await service(usersService.getMultiple, false)({
            query: req.query,
        });
        res.status(200).json(buildResponse(req, {
            data: user.data,
            pagination: {
                count: user.count,
                page: req.query.page,
                per_page: req.query.per_page,
            },
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: usersSchema.getMultiple,
    controller: getMultipleController,
};
//# sourceMappingURL=get-multiple.js.map