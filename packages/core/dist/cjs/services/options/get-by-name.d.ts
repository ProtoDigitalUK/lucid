import { PoolClient } from "pg";
import { OptionT } from "../../db/models/Option.js";
export interface ServiceData {
    name: OptionT["option_name"];
}
declare const getByName: (client: PoolClient, data: ServiceData) => Promise<import("@lucid/types/src/options").OptionsResT>;
export default getByName;
//# sourceMappingURL=get-by-name.d.ts.map