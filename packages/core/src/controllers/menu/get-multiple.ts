// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import menusSchema from "@schemas/menus.js";
// Services
import menusService from "@services/menu/index.js";

// --------------------------------------------------
// Controller
const getMultipleController: Controller<
  typeof menusSchema.getMultiple.params,
  typeof menusSchema.getMultiple.body,
  typeof menusSchema.getMultiple.query
> = async (request, reply) => {
  const menusRes = await service(
    menusService.getMultiple,
    false
  )({
    query: request.query,
    environment_key: request.headers["headless-environment"] as string,
  });

  reply.status(200).send(
    buildResponse(request, {
      data: menusRes.data,
      pagination: {
        count: menusRes.count,
        page: request.query.page as string,
        per_page: request.query.per_page as string,
      },
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: menusSchema.getMultiple,
  controller: getMultipleController,
};
