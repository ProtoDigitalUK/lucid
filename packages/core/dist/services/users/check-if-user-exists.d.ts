export interface ServiceData {
    email: string;
    username: string;
}
declare const checkIfUserExists: (data: ServiceData) => Promise<import("../../utils/format/format-user").UserResT>;
export default checkIfUserExists;
//# sourceMappingURL=check-if-user-exists.d.ts.map