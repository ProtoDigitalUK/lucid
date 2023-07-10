// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import authSchema from "@schemas/auth";
// Services
import auth from "@services/auth";

// --------------------------------------------------
// Controller
const registerSuperAdminController: Controller<
  typeof authSchema.registerSuperAdmin.params,
  typeof authSchema.registerSuperAdmin.body,
  typeof authSchema.registerSuperAdmin.query
> = async (req, res, next) => {
  try {
    const user = await auth.registerSuperAdmin({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    res.status(200).json(
      buildResponse(req, {
        data: user,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: authSchema.registerSuperAdmin,
  controller: registerSuperAdminController,
};