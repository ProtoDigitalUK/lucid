// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Role from "@db/models/Role";
// Schema
import rolesSchema from "@schemas/roles";

// --------------------------------------------------
// Controller
const createSingle: Controller<
  typeof rolesSchema.createSingle.params,
  typeof rolesSchema.createSingle.body,
  typeof rolesSchema.createSingle.query
> = async (req, res, next) => {
  try {
    // TODO: add validation for permissions against permissions in constant file

    const role = await Role.createSingle({
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
  schema: rolesSchema.createSingle,
  controller: createSingle,
};
