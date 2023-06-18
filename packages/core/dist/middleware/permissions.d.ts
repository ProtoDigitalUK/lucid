import { Request, Response, NextFunction } from "express";
declare const permissions: (permissions: Array<string>) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default permissions;
//# sourceMappingURL=permissions.d.ts.map