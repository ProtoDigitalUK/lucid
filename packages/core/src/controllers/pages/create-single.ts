// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import pagesSchema from "@schemas/pages.js";
// Services
import pagesService from "@services/pages/index.js";

// --------------------------------------------------
// Controller
const createSingleController: Controller<
  typeof pagesSchema.createSingle.params,
  typeof pagesSchema.createSingle.body,
  typeof pagesSchema.createSingle.query
> = async (request, reply) => {
  const page = await service(
    pagesService.createSingle,
    false
  )({
    environment_key: request.headers["lucid-environment"] as string,
    collection_key: request.body.collection_key,
    homepage: request.body.homepage,
    published: request.body.published,
    parent_id: request.body.parent_id,
    category_ids: request.body.category_ids,
    userId: request.auth.id,
    translations: request.body.translations,
  });

  reply.status(200).send(
    buildResponse(request, {
      data: page,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: pagesSchema.createSingle,
  controller: createSingleController,
};
