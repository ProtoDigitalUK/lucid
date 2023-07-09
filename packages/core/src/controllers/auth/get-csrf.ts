// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import authSchema from "@schemas/auth";
// Services
import auth from "@services/auth";

// --------------------------------------------------
// Controller
const getCSRFController: Controller<
  typeof authSchema.getCSRF.params,
  typeof authSchema.getCSRF.body,
  typeof authSchema.getCSRF.query
> = async (req, res, next) => {
  try {
    const token = auth.csrf.generateCSRFToken(res);

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
