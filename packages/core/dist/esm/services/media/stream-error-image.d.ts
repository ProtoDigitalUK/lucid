import { NextFunction, Response } from "express";
export interface ServiceData {
    fallback?: "1" | "0";
    error: Error;
    res: Response;
    next: NextFunction;
}
declare const streamErrorImage: (data: ServiceData) => Promise<void>;
export default streamErrorImage;
//# sourceMappingURL=stream-error-image.d.ts.map