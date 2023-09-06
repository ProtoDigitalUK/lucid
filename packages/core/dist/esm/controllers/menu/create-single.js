import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import menusSchema from "../../schemas/menus.js";
import menusService from "../../services/menu/index.js";
const createSingleController = async (req, res, next) => {
    try {
        const menu = await service(menusService.createSingle, true)({
            environment_key: req.headers["lucid-environment"],
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
    schema: menusSchema.createSingle,
    controller: createSingleController,
};
//# sourceMappingURL=create-single.js.map