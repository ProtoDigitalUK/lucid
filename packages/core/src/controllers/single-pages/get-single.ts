// Utils
import buildResponse from "@utils/app/build-response";
// Schema
import singlePageSchema from "@schemas/single-page";
// Services
import singlePages from "@services/single-pages";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof singlePageSchema.getSingle.params,
  typeof singlePageSchema.getSingle.body,
  typeof singlePageSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const singlepage = await singlePages.getSingle({
      environment_key: req.headers["lucid-environment"] as string,
      collection_key: req.params.collection_key,
    });

    res.status(200).json(
      buildResponse(req, {
        data: singlepage,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: singlePageSchema.getSingle,
  controller: getSingleController,
};
