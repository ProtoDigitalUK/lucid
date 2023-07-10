// Services
import { CollectionT } from "@services/collections";
import { CollectionBuilderT } from "@lucid/collection-builder";

const formatCollection = (instance: CollectionBuilderT): CollectionT => {
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
