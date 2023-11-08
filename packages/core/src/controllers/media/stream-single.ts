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
> = async (request, reply) => {
  try {
    const response = await mediaService.streamMedia({
      key: request.params.key,
      query: request.query,
    });

    reply.header("Cache-Control", "public, max-age=31536000, immutable");

    if (response !== undefined) {
      reply.header(
        "Content-Disposition",
        `inline; filename="${request.params.key}"`
      );

      if (response.contentLength) {
        reply.header("Content-Length", response.contentLength);
      }
      if (response.contentType) {
        reply.header("Content-Type", response.contentType);
      }

      if (response.body !== undefined) {
        return reply.send(response.body);
      }
    }

    return reply.status(404).send();
  } catch (error) {
    const { body, contentType } = await mediaService.streamErrorImage({
      fallback: request.query?.fallback,
      error: error as Error,
    });

    reply.header("Content-Type", contentType);
    return reply.send(body);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: mediaSchema.streamSingle,
  controller: streamSingleController,
};
