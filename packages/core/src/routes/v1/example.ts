import { Router } from "express";
import r from "@utils/route";
// Controller
import getSingle, {
  body,
  query,
  params,
} from "@controllers/example/get-single";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/:id",
  schema: {
    params,
    query,
    body,
  },
  controller: getSingle,
});

export default router;
