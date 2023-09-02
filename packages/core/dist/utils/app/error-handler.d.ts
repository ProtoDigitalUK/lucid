import { Request, Response, NextFunction } from "express";
import z from "zod";
interface LucidErrorData {
    type: "validation" | "basic" | "forbidden" | "authorisation";
    name?: string;
    message?: string;
    status?: number;
    code?: "csrf";
    zod?: z.ZodError;
    errors?: ErrorResult;
}
export interface ErrorResult {
    code?: string;
    message?: string;
    children?: Array<undefined | ErrorResult>;
    [key: string]: Array<undefined | ErrorResult> | string | undefined | ErrorResult;
}
declare class LucidError extends Error {
    #private;
    code: LucidErrorData["code"] | null;
    status: number;
    errors: ErrorResult | null;
    constructor(data: LucidErrorData);
}
declare class RuntimeError extends Error {
    constructor(message: string);
}
export declare const decodeError: (error: Error) => {
    name: string;
    message: string;
    status: number;
    errors: ErrorResult | null;
    code: "csrf" | null | undefined;
};
declare const modelErrors: (error: ErrorResult) => ErrorResult;
declare const errorLogger: (error: Error, req: Request, res: Response, next: NextFunction) => void;
declare const errorResponder: (error: Error, req: Request, res: Response, next: NextFunction) => void;
declare const invalidPathHandler: (error: Error, req: Request, res: Response, next: NextFunction) => void;
export { LucidError, RuntimeError, modelErrors, errorLogger, errorResponder, invalidPathHandler, };
//# sourceMappingURL=error-handler.d.ts.map