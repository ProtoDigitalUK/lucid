// Utils
import buildResponse from "@utils/controllers/build-response";
// Models
import RolePermission from "@db/models/RolePermission";
// Schema
import permissionsSchema from "@schemas/permissions";

// --------------------------------------------------
// Controller
const getAll: Controller<
  typeof permissionsSchema.getAll.params,
  typeof permissionsSchema.getAll.body,
  typeof permissionsSchema.getAll.query
> = async (req, res, next) => {
  try {
    res.status(200).json(
      buildResponse(req, {
        data: RolePermission.getValidPermissions,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: permissionsSchema.getAll,
  controller: getAll,
};
