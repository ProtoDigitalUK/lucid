// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Group from "@db/models/Group";
// Schema
import groupsSchema from "@schemas/groups";

// --------------------------------------------------
// Controller
const updateSingle: Controller<
  typeof groupsSchema.updateSingle.params,
  typeof groupsSchema.updateSingle.body,
  typeof groupsSchema.updateSingle.query
> = async (req, res, next) => {
  try {
    const group = await Group.updateSingle(
      req.auth.id,
      req.headers["lucid-environment"] as string,
      req.params.collection_key,
      req.body.bricks
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
  schema: groupsSchema.updateSingle,
  controller: updateSingle,
};
