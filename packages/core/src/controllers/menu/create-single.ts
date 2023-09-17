// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import menusSchema from "@schemas/menus.js";
// Services
import menusService from "@services/menu/index.js";

// --------------------------------------------------
// Controller
const createSingleController: Controller<
  typeof menusSchema.createSingle.params,
  typeof menusSchema.createSingle.body,
  typeof menusSchema.createSingle.query
> = async (req, res, next) => {
  try {
    const menu = await service(
      menusService.createSingle,
      false
    )({
      environment_key: req.headers["lucid-environment"] as string,
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
  schema: menusSchema.createSingle,
  controller: createSingleController,
};
