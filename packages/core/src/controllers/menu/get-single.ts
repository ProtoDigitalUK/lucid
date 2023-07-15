// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import menusSchema from "@schemas/menus";
// Services
import menusService from "@services/menu";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof menusSchema.getSingle.params,
  typeof menusSchema.getSingle.body,
  typeof menusSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const menu = await service(
      menusService.getSingle,
      false
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
  schema: menusSchema.getSingle,
  controller: getSingleController,
};
