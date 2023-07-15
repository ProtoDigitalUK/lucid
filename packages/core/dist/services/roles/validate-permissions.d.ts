import { PoolClient } from "pg";
import { PermissionT, EnvironmentPermissionT } from "../Permissions";
declare const validatePermissions: (client: PoolClient, permGroup: {
    permissions: string[];
    environment_key?: string | undefined;
}[]) => Promise<{
    permission: PermissionT | EnvironmentPermissionT;
    environment_key?: string | undefined;
}[]>;
export default validatePermissions;
//# sourceMappingURL=validate-permissions.d.ts.map