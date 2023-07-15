import { PoolClient } from "pg";
import { OptionT } from "../../db/models/Option";
export interface ServiceData {
    name: OptionT["option_name"];
}
declare const getByName: (client: PoolClient, data: ServiceData) => Promise<OptionT>;
export default getByName;
//# sourceMappingURL=get-by-name.d.ts.map