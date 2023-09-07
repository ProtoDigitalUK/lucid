// Services
import { CollectionBuilderT } from "@builders/collection-builder/index.js";
// Types
import { CollectionResT } from "@lucid/types/src/collections.js";

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
