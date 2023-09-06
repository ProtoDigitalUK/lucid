import { PoolClient } from "pg";
export interface ServiceData {
    email: string;
    username: string;
}
declare const checkIfUserExists: (client: PoolClient, data: ServiceData) => Promise<never>;
export default checkIfUserExists;
//# sourceMappingURL=check-if-user-exists.d.ts.map