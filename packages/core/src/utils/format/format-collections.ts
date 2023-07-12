// Internal
import { CollectionConfigT } from "@lucid/collection-builder";
// Services
import { CollectionBuilderT } from "@lucid/collection-builder";

// -------------------------------------------
// Types
export type CollectionResT = {
  key: CollectionConfigT["key"];
  title: CollectionConfigT["title"];
  singular: CollectionConfigT["singular"];
  description: CollectionConfigT["description"];
  type: CollectionConfigT["type"];

  bricks?: CollectionConfigT["bricks"];
};

const formatCollection = (instance: CollectionBuilderT): CollectionResT => {
  return {
    key: instance.key,
    title: instance.config.title,
    singular: instance.config.singular,
    description: instance.config.description || null,
    type: instance.config.type,
    bricks: instance.config.bricks,
  };
};

export default formatCollection;
