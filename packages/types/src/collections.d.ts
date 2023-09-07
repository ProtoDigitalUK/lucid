// Internal
import { CollectionConfigT } from "../../core/src/builders/collection-builder/index.js";

export interface CollectionResT {
  key: CollectionConfigT["key"];
  title: CollectionConfigT["title"];
  singular: CollectionConfigT["singular"];
  description: CollectionConfigT["description"];
  type: CollectionConfigT["type"];

  bricks?: CollectionConfigT["bricks"];
}
