// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import menusSchema from "@schemas/menus.js";
// Services
import menusService from "@services/menu/index.js";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof menusSchema.deleteSingle.params,
  typeof menusSchema.deleteSingle.body,
  typeof menusSchema.deleteSingle.query
> = async (req, res, next) => {
  try {
    const menu = await service(
      menusService.deleteSingle,
      true
    )({
      environment_key: req.headers["lucid-environment"] as string,
      id: parseInt(req.params.id),
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
  schema: menusSchema.deleteSingle,
  controller: deleteSingleController,
};
