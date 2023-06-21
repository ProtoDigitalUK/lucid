// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Role from "@db/models/Role";
// Schema
import rolesSchema from "@schemas/roles";

// --------------------------------------------------
// Controller
const getMultiple: Controller<
  typeof rolesSchema.getMultiple.params,
  typeof rolesSchema.getMultiple.body,
  typeof rolesSchema.getMultiple.query
> = async (req, res, next) => {
  try {
    const roles = await Role.getMultiple(req.query);

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
  controller: getMultiple,
};
