import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { z } from "zod";
// Schema
import mediaSchema from "@schemas/media.js";
// Services
import mediaService from "@services/media/index.js";

const cdnRoutes = async (fastify: FastifyInstance) => {
  // ------------------------------------
  // Stream single media
  fastify.get<{
    Body: z.infer<typeof mediaSchema.streamSingle.body>;
    Querystring: z.infer<typeof mediaSchema.streamSingle.query>;
    Params: z.infer<typeof mediaSchema.streamSingle.params>;
  }>("/:key", async (request, reply) => {
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
  });
};

export default fp(cdnRoutes);
