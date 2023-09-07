// Utils
import buildResponse from "@utils/app/build-response.js";
// Schema
import authSchema from "@schemas/auth.js";
// Services
import authService from "@services/auth/index.js";

// --------------------------------------------------
// Controller
const getCSRFController: Controller<
  typeof authSchema.getCSRF.params,
  typeof authSchema.getCSRF.body,
  typeof authSchema.getCSRF.query
> = async (req, res, next) => {
  try {
    const token = authService.csrf.generateCSRFToken(res);

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
  controller: getCSRFController,
};
