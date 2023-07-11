export interface ServiceData {
    id: number;
    name?: string;
    permission_groups: Array<{
        environment_key?: string;
        permissions: string[];
    }>;
}
declare const updateSingle: (data: ServiceData) => Promise<import("../../db/models/Role").RoleT>;
export default updateSingle;
//# sourceMappingURL=update-single.d.ts.map