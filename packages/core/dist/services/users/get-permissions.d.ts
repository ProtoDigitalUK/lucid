export interface ServiceData {
    user_id: number;
}
declare const getPermissions: (data: ServiceData) => Promise<import("../../utils/format/format-user-permissions").UserPermissionsResT>;
export default getPermissions;
//# sourceMappingURL=get-permissions.d.ts.map