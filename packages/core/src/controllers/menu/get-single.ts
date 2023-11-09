// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import menusSchema from "@schemas/menus.js";
// Services
import menusService from "@services/menu/index.js";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof menusSchema.getSingle.params,
  typeof menusSchema.getSingle.body,
  typeof menusSchema.getSingle.query
> = async (request, reply) => {
  const menu = await service(
    menusService.getSingle,
    false
  )({
    environment_key: request.headers["lucid-environment"] as string,
    id: parseInt(request.params.id),
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
  schema: menusSchema.getSingle,
  controller: getSingleController,
};
