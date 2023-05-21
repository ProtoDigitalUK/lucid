import z from "zod";
// Models
import User from "@db/models/User";

// --------------------------------------------------
// Schema
const body = z.object({});
const query = z.object({});
const params = z.object({});

// --------------------------------------------------
// Controller
const getAuthenticatedUser: Controller<
  typeof params,
  typeof body,
  typeof query
> = async (req, res, next) => {
  try {
    const user = await User.getById(req.auth.id);

    res.status(200).json({
      data: user,
    });
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
  controller: getAuthenticatedUser,
};
