import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
declare const validate: (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default validate;
//# sourceMappingURL=validate.d.ts.map