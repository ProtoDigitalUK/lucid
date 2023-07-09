// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import permissionsSchema from "@schemas/permissions";
// Services
import getAll from "@services/permissions/get-all";

// --------------------------------------------------
// Controller
const getAllController: Controller<
  typeof permissionsSchema.getAll.params,
  typeof permissionsSchema.getAll.body,
  typeof permissionsSchema.getAll.query
> = async (req, res, next) => {
  try {
    const permissions = await getAll({});

    res.status(200).json(
      buildResponse(req, {
        data: permissions,
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
