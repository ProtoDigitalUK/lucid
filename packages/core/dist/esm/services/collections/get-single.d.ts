import { PoolClient } from "pg";
import { EnvironmentT } from "../../db/models/Environment.js";
import { CollectionConfigT } from "../../builders/collection-builder/index.js";
import { CollectionResT } from "@lucid/types/src/collections.js";
export interface ServiceData {
    collection_key: string;
    environment_key: string;
    type?: CollectionConfigT["type"];
    environment?: EnvironmentT;
}
declare const getSingle: (client: PoolClient, data: ServiceData) => Promise<CollectionResT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map