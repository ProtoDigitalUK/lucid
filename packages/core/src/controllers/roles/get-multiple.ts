// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import rolesSchema from "@schemas/roles";
// Services
import getMultiple from "@services/roles/get-multiple";

// --------------------------------------------------
// Controller
const getMultipleController: Controller<
  typeof rolesSchema.getMultiple.params,
  typeof rolesSchema.getMultiple.body,
  typeof rolesSchema.getMultiple.query
> = async (req, res, next) => {
  try {
    const roles = await getMultiple({
      query: req.query,
    });

    res.status(200).json(
      buildResponse(req, {
        data: roles.data,
        pagination: {
          count: roles.count,
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
  schema: rolesSchema.getMultiple,
  controller: getMultipleController,
};
