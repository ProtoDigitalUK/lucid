/// <reference types="qs" />
import { Request, Response } from "express";
export declare const generateCSRFToken: (res: Response) => string;
export declare const verifyCSRFToken: (req: Request) => boolean;
export declare const clearCSRFToken: (res: Response) => void;
declare const _default: {
    generateCSRFToken: (res: Response<any, Record<string, any>>) => string;
    verifyCSRFToken: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>) => boolean;
    clearCSRFToken: (res: Response<any, Record<string, any>>) => void;
};
export default _default;
//# sourceMappingURL=csrf.d.ts.map