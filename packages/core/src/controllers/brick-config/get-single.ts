// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import bricksSchema from "@schemas/bricks.js";
// Services
import brickConfigService from "@services/brick-config/index.js";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof bricksSchema.config.getSingle.params,
  typeof bricksSchema.config.getSingle.body,
  typeof bricksSchema.config.getSingle.query
> = async (request, reply) => {
  const brick = await service(
    brickConfigService.getSingle,
    false
  )({
    brick_key: request.params.brick_key,
  });

  reply.status(200).send(
    buildResponse(request, {
      data: brick,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: bricksSchema.config.getSingle,
  controller: getSingleController,
};
