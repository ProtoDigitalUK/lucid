// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import rolesSchema from "@schemas/roles";
// Services
import roles from "@services/roles";

// --------------------------------------------------
// Controller
const getMultipleController: Controller<
  typeof rolesSchema.getMultiple.params,
  typeof rolesSchema.getMultiple.body,
  typeof rolesSchema.getMultiple.query
> = async (req, res, next) => {
  try {
    const rolesRes = await roles.getMultiple({
      query: req.query,
    });

    res.status(200).json(
      buildResponse(req, {
        data: rolesRes.data,
        pagination: {
          count: rolesRes.count,
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
