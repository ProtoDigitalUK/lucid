// Services
import buildResponse from "@services/controllers/build-response";
import { sendEmailExternal } from "@services/emails/send-email";
// Schema
import healthSchema from "@schemas/health";

// --------------------------------------------------
// Controller
const tempSend: Controller<
  typeof healthSchema.getHealth.params,
  typeof healthSchema.getHealth.body,
  typeof healthSchema.getHealth.query
> = async (req, res, next) => {
  try {
    // TODO: remove this, it's just for testing
    const status = await sendEmailExternal("forgot-password", {
      data: {
        name: "William Yallop",
      },
      options: {
        to: "wyallop14@gmail.com",
        subject: "Forgot Password",
      },
    });

    res.status(200).json(
      buildResponse(req, {
        data: {
          success: status.success,
          message: status.message,
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
  schema: healthSchema.getHealth,
  controller: tempSend,
};
