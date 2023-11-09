// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import pagesSchema from "@schemas/pages.js";
// Services
import pagesService from "@services/pages/index.js";

// --------------------------------------------------
// Controller
const updateSingleController: Controller<
  typeof pagesSchema.updateSingle.params,
  typeof pagesSchema.updateSingle.body,
  typeof pagesSchema.updateSingle.query
> = async (request, reply) => {
  const page = await service(
    pagesService.updateSingle,
    true
  )({
    id: parseInt(request.params.id),
    environment_key: request.headers["lucid-environment"] as string,

    homepage: request.body.homepage,
    parent_id: request.body.parent_id,
    author_id: request.body.author_id,
    category_ids: request.body.category_ids,
    published: request.body.published,
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
  schema: pagesSchema.updateSingle,
  controller: updateSingleController,
};
