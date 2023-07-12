export interface ServiceData {
    userId: number;
}
declare const getAuthenticatedUser: (data: ServiceData) => Promise<import("../../utils/format/format-user").UserResT>;
export default getAuthenticatedUser;
//# sourceMappingURL=get-single.d.ts.map