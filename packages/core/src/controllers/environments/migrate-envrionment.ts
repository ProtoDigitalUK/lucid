// Services
import buildResponse from "@services/controllers/build-response";
// Schema
import environmentSchema from "@schemas/environments";

// --------------------------------------------------
// Controller
const migrateEnvironment: Controller<
  typeof environmentSchema.migrateEnvironment.params,
  typeof environmentSchema.migrateEnvironment.body,
  typeof environmentSchema.migrateEnvironment.query
> = async (req, res, next) => {
  try {
    /*
      This route will migrate data from one envrionemnt to another.
      This means deleting the target envrionments data,
      then looking up all data that is scoped to the current envrionemnt and copying it over to the target envrionemnt.
    */

    res.status(200).json(
      buildResponse(req, {
        data: {
          message: "Environment migrated successfully",
        },
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: environmentSchema.migrateEnvironment,
  controller: migrateEnvironment,
};
