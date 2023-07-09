// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import menusSchema from "@schemas/menus";
// Services
import deleteSingle from "@services/menu/delete-single";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof menusSchema.deleteSingle.params,
  typeof menusSchema.deleteSingle.body,
  typeof menusSchema.deleteSingle.query
> = async (req, res, next) => {
  try {
    const menu = await deleteSingle({
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
