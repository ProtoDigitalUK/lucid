import { CollectionConfigT } from "@lucid/collection-builder";
import { CollectionBuilderT } from "@lucid/collection-builder";
export type CollectionResT = {
    key: CollectionConfigT["key"];
    title: CollectionConfigT["title"];
    singular: CollectionConfigT["singular"];
    description: CollectionConfigT["description"];
    type: CollectionConfigT["type"];
    bricks?: CollectionConfigT["bricks"];
};
declare const formatCollection: (instance: CollectionBuilderT) => CollectionResT;
export default formatCollection;
//# sourceMappingURL=format-collections.d.ts.map