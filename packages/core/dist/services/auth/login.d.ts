import { PoolClient } from "pg";
export interface ServiceData {
    username: string;
    password: string;
}
declare const login: (client: PoolClient, data: ServiceData) => Promise<import("../../../../types/src/users").UserResT>;
export default login;
//# sourceMappingURL=login.d.ts.map