import { Router } from "express";
import z from "zod";
import { PermissionT, EnvironmentPermissionT } from "@lucid/types/src/permissions";
type Route = <ParamsT extends z.ZodTypeAny, BodyT extends z.ZodTypeAny, QueryT extends z.ZodTypeAny>(router: Router, props: {
    method: "get" | "post" | "put" | "delete" | "patch";
    path: string;
    permissions?: {
        global?: PermissionT[];
        environments?: EnvironmentPermissionT[];
    };
    middleware?: {
        authenticate?: boolean;
        authoriseCSRF?: boolean;
        paginated?: boolean;
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