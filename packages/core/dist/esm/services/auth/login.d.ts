import { PoolClient } from "pg";
export interface ServiceData {
    username: string;
    password: string;
}
declare const login: (client: PoolClient, data: ServiceData) => Promise<import("@lucid/types/src/users.js").UserResT>;
export default login;
//# sourceMappingURL=login.d.ts.map