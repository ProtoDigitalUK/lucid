// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Menu from "@db/models/Menu";
// Schema
import menusSchema from "@schemas/menus";

// --------------------------------------------------
// Controller
const createSingle: Controller<
  typeof menusSchema.createSingle.params,
  typeof menusSchema.createSingle.body,
  typeof menusSchema.createSingle.query
> = async (req, res, next) => {
  try {
    const role = await Menu.createSingle({
      environment_key: req.headers["lucid-environment"] as string,
      key: req.body.key,
      name: req.body.name,
      description: req.body.description,
      items: req.body.items,
    });

    res.status(200).json(
      buildResponse(req, {
        data: role,
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
  controller: createSingle,
};
