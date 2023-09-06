import { PermissionGroup } from "@lucid/types/src/permissions.js";
export default class Permissions {
    static get raw(): Record<string, PermissionGroup>;
    static get permissions(): {
        global: (import("@lucid/types/src/permissions.js").PermissionT | import("@lucid/types/src/permissions.js").EnvironmentPermissionT)[];
        environment: (import("@lucid/types/src/permissions.js").PermissionT | import("@lucid/types/src/permissions.js").EnvironmentPermissionT)[];
    };
}
//# sourceMappingURL=Permissions.d.ts.map