import { Router } from "express";
import z from "zod";
type Route = <ParamsT extends z.ZodTypeAny, BodyT extends z.ZodTypeAny, QueryT extends z.ZodTypeAny>(router: Router, props: {
    method: "get" | "post" | "put" | "delete" | "patch";
    path: string;
    authenticate?: boolean;
    authoriseCSRF?: boolean;
    schema?: {
        params?: z.ZodTypeAny;
        query?: z.ZodTypeAny;
        body?: z.ZodTypeAny;
    };
    controller: Controller<ParamsT, BodyT, QueryT>;
}) => Router;
declare const route: Route;
export default route;
//# sourceMappingURL=route.d.ts.map