import { Router } from "express";
import r from "../../utils/app/route.js";
import getAll from "../../controllers/permissions/get-all.js";
const router = Router();
r(router, {
    method: "get",
    path: "/",
    middleware: {
        authenticate: true,
    },
    schema: getAll.schema,
    controller: getAll.controller,
});
export default router;
//# sourceMappingURL=permissions.routes.js.map