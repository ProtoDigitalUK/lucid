import z from "zod";
// Services
import buildResponse from "@services/controllers/build-response";
import { clearJWT } from "@services/auth/jwt";
import { clearCSRFToken } from "@services/auth/csrf";

// --------------------------------------------------
// Schema
const body = z.object({});
const query = z.object({});
const params = z.object({});

// --------------------------------------------------
// Controller
const logout: Controller<typeof params, typeof body, typeof query> = async (
  req,
  res,
  next
) => {
  try {
    clearJWT(res);
    clearCSRFToken(res);

    res.status(200).json(
      buildResponse(req, {
        data: {
          message: "Logged out successfully",
        },
      })
    );
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
  controller: logout,
};
