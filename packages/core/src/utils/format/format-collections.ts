// Services
import { CollectionBuilderT } from "@lucid/collection-builder";
// Types
import { CollectionResT } from "@lucid/types/src/collections";

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
