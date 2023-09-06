import { PoolClient } from "pg";
import { UserTokenT } from "../../db/models/UserToken.js";
export interface ServiceData {
    token_type: UserTokenT["token_type"];
    token: string;
}
declare const getSingle: (client: PoolClient, data: ServiceData) => Promise<UserTokenT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map