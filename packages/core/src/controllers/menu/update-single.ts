// Utils
import buildResponse from "@utils/controllers/build-response";
// Models
import Menu from "@db/models/Menu";
// Schema
import menusSchema from "@schemas/menus";

// --------------------------------------------------
// Controller
const updateSingle: Controller<
  typeof menusSchema.updateSingle.params,
  typeof menusSchema.updateSingle.body,
  typeof menusSchema.updateSingle.query
> = async (req, res, next) => {
  try {
    const menu = await Menu.updateSingle({
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
  controller: updateSingle,
};
