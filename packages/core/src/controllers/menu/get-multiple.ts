// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import menusSchema from "@schemas/menus";
// Services
import menusService from "@services/menu";

// --------------------------------------------------
// Controller
const getMultipleController: Controller<
  typeof menusSchema.getMultiple.params,
  typeof menusSchema.getMultiple.body,
  typeof menusSchema.getMultiple.query
> = async (req, res, next) => {
  try {
    const menusRes = await service(
      menusService.getMultiple,
      false
    )({
      query: req.query,
      environment_key: req.headers["lucid-environment"] as string,
    });

    res.status(200).json(
      buildResponse(req, {
        data: menusRes.data,
        pagination: {
          count: menusRes.count,
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
