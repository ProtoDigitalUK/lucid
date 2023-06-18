"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const validate_1 = __importDefault(require("../middleware/validate"));
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const authorise_csrf_1 = __importDefault(require("../middleware/authorise-csrf"));
const paginated_1 = __importDefault(require("../middleware/paginated"));
const validate_bricks_1 = __importDefault(require("../middleware/validate-bricks"));
const validate_environment_1 = __importDefault(require("../middleware/validate-environment"));
const permissions_1 = __importDefault(require("../middleware/permissions"));
const route = (router, props) => {
    const { method, path, controller } = props;
    const middleware = [];
    if (props.middleware?.authoriseCSRF) {
        middleware.push(authorise_csrf_1.default);
    }
    if (props.middleware?.authenticate) {
        middleware.push(authenticate_1.default);
    }
    if (props.schema?.params || props.schema?.body || props.schema?.query) {
        middleware.push((0, validate_1.default)(zod_1.default.object({
            params: props.schema?.params ?? zod_1.default.object({}),
            query: props.schema?.query ?? zod_1.default.object({}),
            body: props.schema?.body ?? zod_1.default.object({}),
        })));
    }
    if (props.middleware?.validateBricks) {
        middleware.push(validate_bricks_1.default);
    }
    if (props.middleware?.paginated) {
        middleware.push(paginated_1.default);
    }
    if (props.middleware?.validateEnvironment) {
        middleware.push(validate_environment_1.default);
    }
    if (props.permissions) {
        middleware.push((0, permissions_1.default)(props.permissions));
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