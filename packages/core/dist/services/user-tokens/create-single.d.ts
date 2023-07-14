import { UserTokenT } from "../../db/models/UserToken";
export interface ServiceData {
    user_id: number;
    token_type: UserTokenT["token_type"];
    expiry_date: string;
}
declare const createSingle: (data: ServiceData) => Promise<UserTokenT>;
export default createSingle;
//# sourceMappingURL=create-single.d.ts.map