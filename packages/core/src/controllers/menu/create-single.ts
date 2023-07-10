// Utils
import buildResponse from "@utils/app/build-response";
// Schema
import menusSchema from "@schemas/menus";
// Services
import menus from "@services/menu";

// --------------------------------------------------
// Controller
const createSingleController: Controller<
  typeof menusSchema.createSingle.params,
  typeof menusSchema.createSingle.body,
  typeof menusSchema.createSingle.query
> = async (req, res, next) => {
  try {
    const menu = await menus.createSingle({
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
