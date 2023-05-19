import { Request, Response, NextFunction } from "express";
declare class LucidError extends Error {
    #private;
    status: number;
    errors: ErrorResult | null;
    constructor(data: LucidErrorData);
}
declare const errorLogger: (error: Error, req: Request, res: Response, next: NextFunction) => void;
declare const errorResponder: (error: Error, req: Request, res: Response, next: NextFunction) => void;
declare const invalidPathHandler: (error: Error, req: Request, res: Response, next: NextFunction) => void;
export { LucidError, errorLogger, errorResponder, invalidPathHandler };
//# sourceMappingURL=error-handler.d.ts.map