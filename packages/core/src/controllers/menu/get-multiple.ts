// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import menusSchema from "@schemas/menus";
// Services
import getMultiple from "@services/menu/get-multiple";

// --------------------------------------------------
// Controller
const getMultipleController: Controller<
  typeof menusSchema.getMultiple.params,
  typeof menusSchema.getMultiple.body,
  typeof menusSchema.getMultiple.query
> = async (req, res, next) => {
  try {
    const menus = await getMultiple({
      query: req.query,
      environment_key: req.headers["lucid-environment"] as string,
    });

    res.status(200).json(
      buildResponse(req, {
        data: menus.data,
        pagination: {
          count: menus.count,
          page: req.query.page as string,
          per_page: req.query.per_page as string,
        },
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: menusSchema.getMultiple,
  controller: getMultipleController,
};
