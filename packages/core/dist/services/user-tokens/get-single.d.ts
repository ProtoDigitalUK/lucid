import { UserTokenT } from "../../db/models/UserToken";
export interface ServiceData {
    token_type: UserTokenT["token_type"];
    token: string;
}
declare const getSingle: (data: ServiceData) => Promise<UserTokenT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map