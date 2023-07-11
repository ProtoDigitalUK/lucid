export interface ServiceData {
    user_id: number;
}
declare const getPermissions: (data: ServiceData) => Promise<import("./format-permissions").UserPermissionsRes>;
export default getPermissions;
//# sourceMappingURL=get-permissions.d.ts.map