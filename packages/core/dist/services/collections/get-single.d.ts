import { EnvironmentT } from "../../db/models/Environment";
import { CollectionConfigT } from "@lucid/collection-builder";
import { CollectionT } from "../collections";
export interface ServiceData {
    collection_key: string;
    environment_key: string;
    type?: CollectionConfigT["type"];
    environment?: EnvironmentT;
}
declare const getSingle: (data: ServiceData) => Promise<CollectionT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map