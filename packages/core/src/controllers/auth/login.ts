// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import authSchema from "@schemas/auth.js";
// Services
import authService from "@services/auth/index.js";

// --------------------------------------------------
// Controller
const loginController: Controller<
  typeof authSchema.login.params,
  typeof authSchema.login.body,
  typeof authSchema.login.query
> = async (request, reply) => {
  const user = await service(
    authService.login,
    false
  )({
    username: request.body.username,
    password: request.body.password,
  });
  authService.jwt.generateJWT(reply, user);

  reply.status(200).send(buildResponse(request, { data: user }));
};

// --------------------------------------------------
// Export
export default {
  schema: authSchema.login,
  controller: loginController,
};
