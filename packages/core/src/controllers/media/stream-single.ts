// Schema
import mediaSchema from "@schemas/media.js";
// Services
import mediaService from "@services/media/index.js";

// --------------------------------------------------
// Controller
const streamSingleController: Controller<
  typeof mediaSchema.streamSingle.params,
  typeof mediaSchema.streamSingle.body,
  typeof mediaSchema.streamSingle.query
> = async (req, res, next) => {
  try {
    const response = await mediaService.streamMedia({
      key: req.params.key,
      query: req.query,
    });

    // --------------------------------------------------
    // Send response
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    if (response !== undefined) {
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${req.params.key}"`
      );
      if (response?.contentLength)
        res.setHeader("Content-Length", response.contentLength);
      if (response?.contentType)
        res.setHeader("Content-Type", response.contentType);

      if (response?.body !== undefined) response.body.pipe(res);
    }
  } catch (error) {
    await mediaService.streamErrorImage({
      fallback: req.query?.fallback,
      error: error as Error,
      res: res,
      next: next,
    });
  }
};

// --------------------------------------------------
// Export
export default {
  schema: mediaSchema.streamSingle,
  controller: streamSingleController,
};
