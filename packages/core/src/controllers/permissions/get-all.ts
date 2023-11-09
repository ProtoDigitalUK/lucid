// Utils
import buildResponse from "@utils/app/build-response.js";
import Permissions from "@services/Permissions.js";
// Schema
import permissionsSchema from "@schemas/permissions.js";
// Format
import formatPermissions from "@utils/format/format-permissions.js";

// --------------------------------------------------
// Controller
const getAllController: Controller<
  typeof permissionsSchema.getAll.params,
  typeof permissionsSchema.getAll.body,
  typeof permissionsSchema.getAll.query
> = async (request, reply) => {
  const permissionsRes = formatPermissions(Permissions.raw);

  reply.status(200).send(
    buildResponse(request, {
      data: permissionsRes,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: permissionsSchema.getAll,
  controller: getAllController,
};
