import z from "zod";
// Services
import buildResponse from "@services/controllers/build-response";

// --------------------------------------------------
// Schema
const body = z.object({});
const query = z.object({});
const params = z.object({
  key: z.string(),
});

// --------------------------------------------------
// Controller
const migrateEnvironment: Controller<
  typeof params,
  typeof body,
  typeof query
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
  schema: {
    body,
    query,
    params,
  },
  controller: migrateEnvironment,
};
