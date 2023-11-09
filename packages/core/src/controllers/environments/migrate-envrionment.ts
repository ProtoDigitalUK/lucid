// Utils
import buildResponse from "@utils/app/build-response.js";
// Schema
import environmentSchema from "@schemas/environments.js";
// Services
import environmentsService from "@services/environments/index.js";

// --------------------------------------------------
// Controller
const migrateEnvironmentController: Controller<
  typeof environmentSchema.migrateEnvironment.params,
  typeof environmentSchema.migrateEnvironment.body,
  typeof environmentSchema.migrateEnvironment.query
> = async (request, reply) => {
  /*
      This route will migrate data from one envrionemnt to another.
      This means deleting the target envrionments data,
      then looking up all data that is scoped to the current envrionemnt and copying it over to the target envrionemnt.
    */
  await environmentsService.migrateEnvironment({});

  reply.status(200).send(
    buildResponse(request, {
      data: {
        message: "Environment migrated successfully",
      },
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: environmentSchema.migrateEnvironment,
  controller: migrateEnvironmentController,
};
