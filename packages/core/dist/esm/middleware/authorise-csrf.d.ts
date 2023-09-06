import { Request, Response, NextFunction } from "express";
declare const authoriseCSRF: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default authoriseCSRF;
//# sourceMappingURL=authorise-csrf.d.ts.map