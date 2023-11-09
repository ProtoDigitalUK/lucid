// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import bricksSchema from "@schemas/bricks.js";
// Services
import brickConfigService from "@services/brick-config/index.js";

// --------------------------------------------------
// Controller
const getAllController: Controller<
  typeof bricksSchema.config.getAll.params,
  typeof bricksSchema.config.getAll.body,
  typeof bricksSchema.config.getAll.query
> = async (request, reply) => {
  const bricks = await service(
    brickConfigService.getAll,
    false
  )({
    query: request.query,
  });

  reply.status(200).send(
    buildResponse(request, {
      data: bricks,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: bricksSchema.config.getAll,
  controller: getAllController,
};
