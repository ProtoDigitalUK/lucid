import z from "zod";
// Services
import buildResponse from "@services/controllers/build-response";
import { generateJWT } from "@services/auth/jwt";
// Models
import User from "@db/models/User";

// --------------------------------------------------
// Schema
const body = z.object({
  username: z.string(),
  password: z.string(),
});
const query = z.object({});
const params = z.object({});

// --------------------------------------------------
// Controller
const login: Controller<typeof params, typeof body, typeof query> = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.login(req.body.username, req.body.password);
    generateJWT(res, user[0]);

    res.status(200).json(buildResponse(req, { data: user }));
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: {
    body,
    query,
    params,
  },
  controller: login,
};
