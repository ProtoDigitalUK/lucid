import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import menusSchema from "../../schemas/menus.js";
import menusService from "../../services/menu/index.js";
const updateSingleController = async (req, res, next) => {
    try {
        const menu = await service(menusService.updateSingle, true)({
            environment_key: req.headers["lucid-environment"],
            id: parseInt(req.params.id),
            key: req.body.key,
            name: req.body.name,
            description: req.body.description,
            items: req.body.items,
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
    schema: menusSchema.updateSingle,
    controller: updateSingleController,
};
//# sourceMappingURL=update-single.js.map