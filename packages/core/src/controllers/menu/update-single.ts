// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import menusSchema from "@schemas/menus.js";
// Services
import menusService from "@services/menu/index.js";

// --------------------------------------------------
// Controller
const updateSingleController: Controller<
  typeof menusSchema.updateSingle.params,
  typeof menusSchema.updateSingle.body,
  typeof menusSchema.updateSingle.query
> = async (req, res, next) => {
  try {
    const menu = await service(
      menusService.updateSingle,
      true
    )({
      environment_key: req.headers["lucid-environment"] as string,
      id: parseInt(req.params.id),

      key: req.body.key,
      name: req.body.name,
      description: req.body.description,
      items: req.body.items,
    });

    res.status(200).json(
      buildResponse(req, {
        data: menu,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: menusSchema.updateSingle,
  controller: updateSingleController,
};
