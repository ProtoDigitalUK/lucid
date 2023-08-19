import { PermissionGroup } from "@lucid/types/src/permissions";
export default class Permissions {
    static get raw(): Record<string, PermissionGroup>;
    static get permissions(): {
        global: (import("@lucid/types/src/permissions").PermissionT | import("@lucid/types/src/permissions").EnvironmentPermissionT)[];
        environment: (import("@lucid/types/src/permissions").PermissionT | import("@lucid/types/src/permissions").EnvironmentPermissionT)[];
    };
}
//# sourceMappingURL=Permissions.d.ts.map