/// <reference types="node" />
import { Request, Response, NextFunction } from "express";
import { PermissionT, EnvironmentPermissionT } from "../db/models/RolePermission";
declare const permissions: (permissions: {
    global?: PermissionT[];
    environments?: EnvironmentPermissionT[];
}) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default permissions;
//# sourceMappingURL=permissions.d.ts.map