import { PermissionT, EnvironmentPermissionT } from "../../utils/app/Permissions";
declare const validatePermissions: (permGroup: {
    permissions: string[];
    environment_key?: string | undefined;
}[]) => Promise<{
    permission: PermissionT | EnvironmentPermissionT;
    environment_key?: string | undefined;
}[]>;
export default validatePermissions;
//# sourceMappingURL=validate-permissions.d.ts.map