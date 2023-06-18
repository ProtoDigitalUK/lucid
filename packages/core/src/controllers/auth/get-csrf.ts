// Services
import buildResponse from "@services/controllers/build-response";
import { generateCSRFToken } from "@services/auth/csrf";
// Schema
import authSchema from "@schemas/auth";

// --------------------------------------------------
// Controller
const getCSRF: Controller<
  typeof authSchema.getCSRF.params,
  typeof authSchema.getCSRF.body,
  typeof authSchema.getCSRF.query
> = async (req, res, next) => {
  try {
    const token = generateCSRFToken(res);

    res.status(200).json(
      buildResponse(req, {
        data: {
          _csrf: token,
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
  schema: authSchema.getCSRF,
  controller: getCSRF,
};
