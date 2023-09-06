import { Router } from "express";
import r from "../../utils/app/route.js";
import streamSingle from "../../controllers/media/stream-single.js";
const router = Router();
r(router, {
    method: "get",
    path: "/:key",
    schema: streamSingle.schema,
    controller: streamSingle.controller,
});
export default router;
//# sourceMappingURL=cdn.routes.js.map