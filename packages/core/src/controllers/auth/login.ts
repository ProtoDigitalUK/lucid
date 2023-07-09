// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import authSchema from "@schemas/auth";
// Services
import { generateJWT } from "@services/auth/jwt";
import login from "@services/auth/login";

// --------------------------------------------------
// Controller
const loginController: Controller<
  typeof authSchema.login.params,
  typeof authSchema.login.body,
  typeof authSchema.login.query
> = async (req, res, next) => {
  try {
    const user = await login({
      username: req.body.username,
      password: req.body.password,
    });
    generateJWT(res, user);
    res.status(200).json(buildResponse(req, { data: user }));
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: authSchema.login,
  controller: loginController,
};
