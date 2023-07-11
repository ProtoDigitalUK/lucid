// Utils
import buildResponse from "@utils/app/build-response";
import Permissions from "@utils/app/Permissions";
// Schema
import permissionsSchema from "@schemas/permissions";

// --------------------------------------------------
// Controller
const getAllController: Controller<
  typeof permissionsSchema.getAll.params,
  typeof permissionsSchema.getAll.body,
  typeof permissionsSchema.getAll.query
> = async (req, res, next) => {
  try {
    const permissionsRes = Permissions.formattedPermissions;

    res.status(200).json(
      buildResponse(req, {
        data: permissionsRes,
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
  controller: getAllController,
};
