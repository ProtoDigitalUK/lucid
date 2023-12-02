// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import menusSchema from "@schemas/menus.js";
// Services
import menusService from "@services/menu/index.js";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof menusSchema.deleteSingle.params,
  typeof menusSchema.deleteSingle.body,
  typeof menusSchema.deleteSingle.query
> = async (request, reply) => {
  const menu = await service(
    menusService.deleteSingle,
    false
  )({
    environment_key: request.headers["headless-environment"] as string,
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
  schema: menusSchema.deleteSingle,
  controller: deleteSingleController,
};
