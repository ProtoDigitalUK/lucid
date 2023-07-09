// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import pagesSchema from "@schemas/pages";
// Services
import pages from "@services/pages";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof pagesSchema.deleteSingle.params,
  typeof pagesSchema.deleteSingle.body,
  typeof pagesSchema.deleteSingle.query
> = async (req, res, next) => {
  try {
    const page = await pages.deleteSingle({
      id: parseInt(req.params.id),
      environment_key: req.headers["lucid-environment"] as string,
    });

    res.status(200).json(
      buildResponse(req, {
        data: page,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: pagesSchema.deleteSingle,
  controller: deleteSingleController,
};
