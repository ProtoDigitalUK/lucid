// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import rolesSchema from "@schemas/roles";
// Services
import createSingle from "@services/roles/create-single";

// --------------------------------------------------
// Controller
const createSingleController: Controller<
  typeof rolesSchema.createSingle.params,
  typeof rolesSchema.createSingle.body,
  typeof rolesSchema.createSingle.query
> = async (req, res, next) => {
  try {
    const role = await createSingle({
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
  controller: createSingleController,
};
