export interface ServiceData {
    userId: number;
}
declare const getAuthenticatedUser: (data: ServiceData) => Promise<import("../../db/models/User").UserT>;
export default getAuthenticatedUser;
//# sourceMappingURL=get-authenticated-user.d.ts.map