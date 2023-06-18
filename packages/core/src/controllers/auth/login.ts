// Services
import buildResponse from "@services/controllers/build-response";
import { generateJWT } from "@services/auth/jwt";
// Models
import User from "@db/models/User";
// Schema
import authSchema from "@schemas/auth";

// --------------------------------------------------
// Controller
const login: Controller<
  typeof authSchema.login.params,
  typeof authSchema.login.body,
  typeof authSchema.login.query
> = async (req, res, next) => {
  try {
    const user = await User.login(req.body.username, req.body.password);
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
  controller: login,
};
