import { Router } from "express";
import r from "../../utils/app/route.js";
import updateMe from "../../controllers/account/update-me.js";
const router = Router();
r(router, {
    method: "patch",
    path: "/",
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: updateMe.schema,
    controller: updateMe.controller,
});
export default router;
//# sourceMappingURL=account.routes.js.map