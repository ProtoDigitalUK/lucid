import { Router } from "express";
import z from "zod";
type Route = <ParamsT extends z.ZodTypeAny, BodyT extends z.ZodTypeAny, QueryT extends z.ZodTypeAny>(router: Router, props: {
    method: "get" | "post" | "put" | "delete" | "patch";
    path: string;
    permissions?: Array<string>;
    middleware?: {
        authenticate?: boolean;
        authoriseCSRF?: boolean;
        paginated?: boolean;
        validateBricks?: boolean;
        validateEnvironment?: boolean;
    };
    schema?: {
        params?: ParamsT;
        body?: BodyT;
        query?: QueryT;
    };
    controller: Controller<ParamsT, BodyT, QueryT>;
}) => Router;
declare const route: Route;
export default route;
//# sourceMappingURL=route.d.ts.map