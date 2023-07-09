// Utils
import buildResponse from "@utils/controllers/build-response";
// Models
import Role from "@db/models/Role";
// Schema
import rolesSchema from "@schemas/roles";

// --------------------------------------------------
// Controller
const deleteSingle: Controller<
  typeof rolesSchema.deleteSingle.params,
  typeof rolesSchema.deleteSingle.body,
  typeof rolesSchema.deleteSingle.query
> = async (req, res, next) => {
  try {
    const role = await Role.deleteSingle(parseInt(req.params.id));

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
  schema: rolesSchema.deleteSingle,
  controller: deleteSingle,
};
