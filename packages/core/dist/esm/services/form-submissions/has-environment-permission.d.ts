import { PoolClient } from "pg";
export interface ServiceData {
    form_key: string;
    environment_key: string;
}
declare const hasEnvironmentPermission: (client: PoolClient, data: ServiceData) => Promise<import("@lucid/types/src/environments.js").EnvironmentResT>;
export default hasEnvironmentPermission;
//# sourceMappingURL=has-environment-permission.d.ts.map