// Utils
import buildResponse from "@utils/controllers/build-response";
// Models
import Role from "@db/models/Role";
// Schema
import rolesSchema from "@schemas/roles";

// --------------------------------------------------
// Controller
const updateSingle: Controller<
  typeof rolesSchema.updateSingle.params,
  typeof rolesSchema.updateSingle.body,
  typeof rolesSchema.updateSingle.query
> = async (req, res, next) => {
  try {
    const role = await Role.updateSingle(parseInt(req.params.id), {
      name: req.body.name,
      permission_groups: req.body.permission_groups,
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
  schema: rolesSchema.updateSingle,
  controller: updateSingle,
};
