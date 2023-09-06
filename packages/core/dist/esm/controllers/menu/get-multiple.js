import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import menusSchema from "../../schemas/menus.js";
import menusService from "../../services/menu/index.js";
const getMultipleController = async (req, res, next) => {
    try {
        const menusRes = await service(menusService.getMultiple, false)({
            query: req.query,
            environment_key: req.headers["lucid-environment"],
        });
        res.status(200).json(buildResponse(req, {
            data: menusRes.data,
            pagination: {
                count: menusRes.count,
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
    schema: menusSchema.getMultiple,
    controller: getMultipleController,
};
//# sourceMappingURL=get-multiple.js.map