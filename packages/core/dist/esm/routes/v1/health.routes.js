import { Router } from "express";
import r from "../../utils/app/route.js";
import getHealth from "../../controllers/health/get-health.js";
const router = Router();
r(router, {
    method: "get",
    path: "/",
    schema: getHealth.schema,
    controller: getHealth.controller,
});
export default router;
//# sourceMappingURL=health.routes.js.map