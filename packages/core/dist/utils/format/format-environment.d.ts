import { EnvironmentT } from "../../db/models/Environment";
export interface EnvironmentResT {
    key: string;
    title: string;
    assigned_bricks: string[];
    assigned_collections: string[];
    assigned_forms: string[];
}
declare const formatEnvironment: (environment: EnvironmentT) => EnvironmentResT;
export default formatEnvironment;
//# sourceMappingURL=format-environment.d.ts.map