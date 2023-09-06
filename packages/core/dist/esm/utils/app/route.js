import z from "zod";
import validate from "../../middleware/validate.js";
import authenticate from "../../middleware/authenticate.js";
import authoriseCSRF from "../../middleware/authorise-csrf.js";
import paginated from "../../middleware/paginated.js";
import validateEnvironment from "../../middleware/validate-environment.js";
import permissions from "../../middleware/permissions.js";
import fileUpload from "../../middleware/file-upload.js";
const route = (router, props) => {
    const { method, path, controller } = props;
    const middleware = [];
    if (props.middleware?.authenticate) {
        middleware.push(authenticate);
    }
    if (props.middleware?.authoriseCSRF) {
        middleware.push(authoriseCSRF);
    }
    if (props.middleware?.fileUpload) {
        middleware.push(fileUpload);
    }
    if (props.schema?.params || props.schema?.body || props.schema?.query) {
        middleware.push(validate(z.object({
            params: props.schema?.params ?? z.object({}),
            query: props.schema?.query ?? z.object({}),
            body: props.schema?.body ?? z.object({}),
        })));
    }
    if (props.middleware?.paginated) {
        middleware.push(paginated);
    }
    if (props.middleware?.validateEnvironment) {
        middleware.push(validateEnvironment);
    }
    if (props.permissions) {
        middleware.push(permissions(props.permissions));
    }
    switch (method) {
        case "get":
            router.get(path, middleware, controller);
            break;
        case "post":
            router.post(path, middleware, controller);
            break;
        case "put":
            router.put(path, middleware, controller);
            break;
        case "delete":
            router.delete(path, middleware, controller);
            break;
        case "patch":
            router.patch(path, middleware, controller);
            break;
        default:
            break;
    }
    return router;
};
export default route;
//# sourceMappingURL=route.js.map