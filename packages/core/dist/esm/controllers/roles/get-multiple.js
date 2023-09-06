import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import rolesSchema from "../../schemas/roles.js";
import rolesService from "../../services/roles/index.js";
const getMultipleController = async (req, res, next) => {
    try {
        const rolesRes = await service(rolesService.getMultiple, false)({
            query: req.query,
        });
        res.status(200).json(buildResponse(req, {
            data: rolesRes.data,
            pagination: {
                count: rolesRes.count,
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
    schema: rolesSchema.getMultiple,
    controller: getMultipleController,
};
//# sourceMappingURL=get-multiple.js.map