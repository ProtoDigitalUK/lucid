export interface ServiceData {
    email: string;
    username: string;
}
declare const checkIfUserExists: (data: ServiceData) => Promise<import("../users").UserResT>;
export default checkIfUserExists;
//# sourceMappingURL=check-if-user-exists.d.ts.map