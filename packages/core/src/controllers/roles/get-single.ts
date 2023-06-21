// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Role from "@db/models/Role";
// Schema
import rolesSchema from "@schemas/roles";

// --------------------------------------------------
// Controller
const getSingle: Controller<
  typeof rolesSchema.getSingle.params,
  typeof rolesSchema.getSingle.body,
  typeof rolesSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const role = await Role.getSingle(parseInt(req.params.id));

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
  schema: rolesSchema.getSingle,
  controller: getSingle,
};
