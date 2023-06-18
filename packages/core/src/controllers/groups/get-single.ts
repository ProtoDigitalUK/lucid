// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Group from "@db/models/Group";
// Schema
import groupsSchema from "@schemas/groups";

// --------------------------------------------------
// Controller
const getSingle: Controller<
  typeof groupsSchema.getSingle.params,
  typeof groupsSchema.getSingle.body,
  typeof groupsSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const group = await Group.getSingle(
      req.headers["lucid-environment"] as string,
      req.params.collection_key
    );

    res.status(200).json(
      buildResponse(req, {
        data: group,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: groupsSchema.getSingle,
  controller: getSingle,
};
