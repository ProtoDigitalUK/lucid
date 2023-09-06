import { PoolClient } from "pg";
import { SettingsResT } from "@lucid/types/src/settings.js";
export interface ServiceData {
    id: number;
}
declare const getSettings: (client: PoolClient) => Promise<SettingsResT>;
export default getSettings;
//# sourceMappingURL=get-settings.d.ts.map