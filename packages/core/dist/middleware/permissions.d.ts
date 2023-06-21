import { Request, Response, NextFunction } from "express";
import { PermissionT } from "../db/models/RolePermission";
declare const permissions: (permissions: Array<PermissionT>) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default permissions;
//# sourceMappingURL=permissions.d.ts.map