import z from "zod";
// Internal packages
import { BrickBuilderT } from "@lucid/brick-builder";
// Schema
import bricksSchema from "@schemas/bricks";
// Services
import { BrickConfigT } from "@services/brick-config";

export interface ServiceData {
  instance: BrickBuilderT;
  query?: z.infer<typeof bricksSchema.config.getAll.query>;
}

const getBrickData = (
  instance: BrickBuilderT,
  query?: z.infer<typeof bricksSchema.config.getAll.query>
): BrickConfigT => {
  const data: BrickConfigT = {
    key: instance.key,
    title: instance.title,
    preview: instance.config?.preview,
  };

  if (!query) return data;

  // Include fields
  if (query.include?.includes("fields")) data.fields = instance.fieldTree;

  return data;
};

export default getBrickData;
