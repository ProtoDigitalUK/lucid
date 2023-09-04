import { PoolClient } from "pg";
import { SettingsResT } from "@lucid/types/src/settings";
export interface ServiceData {
    id: number;
}
declare const getSettings: (client: PoolClient) => Promise<SettingsResT>;
export default getSettings;
//# sourceMappingURL=get-settings.d.ts.map