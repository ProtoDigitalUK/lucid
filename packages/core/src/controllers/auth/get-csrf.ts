import z from "zod";
// Services
import buildResponse from "@services/controllers/build-response";
import { generateCSRFToken } from "@services/auth/csrf";

// --------------------------------------------------
// Schema
const body = z.object({});
const query = z.object({});
const params = z.object({});

// --------------------------------------------------
// Controller
const getCSRF: Controller<typeof params, typeof body, typeof query> = async (
  req,
  res,
  next
) => {
  try {
    const token = generateCSRFToken(res);

    res.status(200).json(
      buildResponse(req, {
        data: [
          {
            csrfToken: token,
          },
        ],
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
  controller: getCSRF,
};
