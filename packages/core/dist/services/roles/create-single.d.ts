export interface ServiceData {
    name: string;
    permission_groups: Array<{
        environment_key?: string;
        permissions: string[];
    }>;
}
declare const createSingle: (data: ServiceData) => Promise<import("../../db/models/Role").RoleT>;
export default createSingle;
//# sourceMappingURL=create-single.d.ts.map