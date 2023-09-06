import { Router } from "express";
import r from "../../utils/app/route.js";
import updateSingle from "../../controllers/single-pages/update-single.js";
import getSingle from "../../controllers/single-pages/get-single.js";
const router = Router();
r(router, {
    method: "patch",
    path: "/:collection_key",
    permissions: {
        environments: ["update_content"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
        validateEnvironment: true,
    },
    schema: updateSingle.schema,
    controller: updateSingle.controller,
});
r(router, {
    method: "get",
    path: "/:collection_key",
    middleware: {
        authenticate: true,
        validateEnvironment: true,
    },
    schema: getSingle.schema,
    controller: getSingle.controller,
});
export default router;
//# sourceMappingURL=single-pages.routes.js.map