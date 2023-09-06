"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const validate_js_1 = __importDefault(require("../../middleware/validate.js"));
const authenticate_js_1 = __importDefault(require("../../middleware/authenticate.js"));
const authorise_csrf_js_1 = __importDefault(require("../../middleware/authorise-csrf.js"));
const paginated_js_1 = __importDefault(require("../../middleware/paginated.js"));
const validate_environment_js_1 = __importDefault(require("../../middleware/validate-environment.js"));
const permissions_js_1 = __importDefault(require("../../middleware/permissions.js"));
const file_upload_js_1 = __importDefault(require("../../middleware/file-upload.js"));
const route = (router, props) => {
    const { method, path, controller } = props;
    const middleware = [];
    if (props.middleware?.authenticate) {
        middleware.push(authenticate_js_1.default);
    }
    if (props.middleware?.authoriseCSRF) {
        middleware.push(authorise_csrf_js_1.default);
    }
    if (props.middleware?.fileUpload) {
        middleware.push(file_upload_js_1.default);
    }
    if (props.schema?.params || props.schema?.body || props.schema?.query) {
        middleware.push((0, validate_js_1.default)(zod_1.default.object({
            params: props.schema?.params ?? zod_1.default.object({}),
            query: props.schema?.query ?? zod_1.default.object({}),
            body: props.schema?.body ?? zod_1.default.object({}),
        })));
    }
    if (props.middleware?.paginated) {
        middleware.push(paginated_js_1.default);
    }
    if (props.middleware?.validateEnvironment) {
        middleware.push(validate_environment_js_1.default);
    }
    if (props.permissions) {
        middleware.push((0, permissions_js_1.default)(props.permissions));
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
exports.default = route;
//# sourceMappingURL=route.js.map