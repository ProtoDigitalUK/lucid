import { Response } from "express";
export interface ServiceData {
    fallback?: "1" | "0";
    res: Response;
}
declare const streamErrorImage: (data: ServiceData) => Promise<void>;
export default streamErrorImage;
//# sourceMappingURL=steam-error-image.d.ts.map