import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import menusSchema from "../../schemas/menus.js";
import menusService from "../../services/menu/index.js";
const deleteSingleController = async (req, res, next) => {
    try {
        const menu = await service(menusService.deleteSingle, true)({
            environment_key: req.headers["lucid-environment"],
            id: parseInt(req.params.id),
        });
        res.status(200).json(buildResponse(req, {
            data: menu,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: menusSchema.deleteSingle,
    controller: deleteSingleController,
};
//# sourceMappingURL=delete-single.js.map