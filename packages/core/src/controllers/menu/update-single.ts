// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import menusSchema from "@schemas/menus.js";
// Services
import menusService from "@services/menu/index.js";

// --------------------------------------------------
// Controller
const updateSingleController: Controller<
  typeof menusSchema.updateSingle.params,
  typeof menusSchema.updateSingle.body,
  typeof menusSchema.updateSingle.query
> = async (request, reply) => {
  const menu = await service(
    menusService.updateSingle,
    true
  )({
    environment_key: request.headers["headless-environment"] as string,
    id: parseInt(request.params.id),

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
  schema: menusSchema.updateSingle,
  controller: updateSingleController,
};
