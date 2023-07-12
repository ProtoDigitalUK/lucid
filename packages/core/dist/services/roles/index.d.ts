declare const _default: {
    createSingle: (data: import("./create-single").ServiceData) => Promise<import("../../db/models/Role").RoleT>;
    deleteSingle: (data: import("./delete-single").ServiceData) => Promise<import("../../db/models/Role").RoleT>;
    getMultiple: (data: import("./get-multiple").ServiceData) => Promise<{
        data: import("../../db/models/Role").RoleT[];
        count: number;
    }>;
    getSingle: (data: import("./get-single").ServiceData) => Promise<import("../../db/models/Role").RoleT>;
    updateSingle: (data: import("./update-single").ServiceData) => Promise<import("../../db/models/Role").RoleT>;
    checkNameIsUnique: (data: import("./check-name-unique").ServiceData) => Promise<never>;
    validatePermissions: (permGroup: {
        permissions: string[];
        environment_key?: string | undefined;
    }[]) => Promise<{
        permission: import("../Permissions").PermissionT | import("../Permissions").EnvironmentPermissionT;
        environment_key?: string | undefined;
    }[]>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map