// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import menusSchema from "@schemas/menus.js";
// Services
import menusService from "@services/menu/index.js";

// --------------------------------------------------
// Controller
const createSingleController: Controller<
  typeof menusSchema.createSingle.params,
  typeof menusSchema.createSingle.body,
  typeof menusSchema.createSingle.query
> = async (request, reply) => {
  const menu = await service(
    menusService.createSingle,
    false
  )({
    environment_key: request.headers["lucid-environment"] as string,
    key: request.body.key,
    name: request.body.name,
    description: request.body.description,
    items: request.body.items,
  });

  reply.status(200).send(
    buildResponse(request, {
      data: menu,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: menusSchema.createSingle,
  controller: createSingleController,
};
