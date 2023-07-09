// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import emailsSchema from "@schemas/email";
// Services
import getMultiple from "@services/email/get-multiple";

// --------------------------------------------------
// Controller
const getMultipleController: Controller<
  typeof emailsSchema.getMultiple.params,
  typeof emailsSchema.getMultiple.body,
  typeof emailsSchema.getMultiple.query
> = async (req, res, next) => {
  try {
    const emails = await getMultiple({
      query: req.query,
    });

    res.status(200).json(
      buildResponse(req, {
        data: emails.data,
        pagination: {
          count: emails.count,
          page: req.query.page as string,
          per_page: req.query.per_page as string,
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
  schema: emailsSchema.getMultiple,
  controller: getMultipleController,
};
