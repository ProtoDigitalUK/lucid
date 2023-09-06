import { Request, Response, NextFunction } from "express";
import z from "zod";
declare const validate: (schema: z.AnyZodObject) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default validate;
//# sourceMappingURL=validate.d.ts.map