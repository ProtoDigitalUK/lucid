import { Readable } from "stream";
// Models
import Media from "@db/models/Media";
// Schema
import mediaSchema from "@schemas/media";

// --------------------------------------------------
// Controller
const streamSingle: Controller<
  typeof mediaSchema.streamSingle.params,
  typeof mediaSchema.streamSingle.body,
  typeof mediaSchema.streamSingle.query
> = async (req, res, next) => {
  try {
    // GET MEDIA
    const response = await Media.streamFile(req.params.key);

    // SET HEADERS
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${req.params.key}"`
    );
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    if (response.ContentLength)
      res.setHeader("Content-Length", response.ContentLength);
    if (response.ContentType)
      res.setHeader("Content-Type", response.ContentType);

    // PIPE STREAM
    (response.Body as Readable).pipe(res);
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: mediaSchema.streamSingle,
  controller: streamSingle,
};
