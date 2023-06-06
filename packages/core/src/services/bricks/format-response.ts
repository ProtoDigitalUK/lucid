// Models
import { BrickFieldsT } from "@db/models/BrickData";
import BrickConfig from "@db/models/BrickConfig";
// Internal packages
import { FieldTypes, BrickBuilderT } from "@lucid/brick-builder";

interface BrickResponseT {
  id: number;
  key: string;
  order: number;
  fields: Array<{
    fields_id: number;
    key: string;
    type: FieldTypes;
    value: any;
    meta?: {
      target?: "_blank" | "_self";
      page_title?: string;
      page_slug?: string;
      page_full_slug?: string;
    };
    items?: Array<BrickResponseT["fields"][0]>;
  }>;
}

// -------------------------------------------
// Build field tree
const buildFieldTree = (
  brickId: number,
  fields: BrickFieldsT[],
  builderInstance: BrickBuilderT
): BrickResponseT["fields"] => {
  const pageBrickSpecificFields = fields.filter((f) => f.id === brickId);

  // Loop over instance field tree and build out the brick field tree on the same structure
  // If a value doenst exist, use the default value from the instance
  // If we have a field that doesnt exists in the instance, dont add it to the tree

  return pageBrickSpecificFields as any;
};

// -------------------------------------------
// Build out base brick structure
const buildBrickStructure = (brickFields: BrickFieldsT[]) => {
  const brickStructure: BrickResponseT[] = [];

  brickFields.forEach((brickField) => {
    const brickStructureIndex = brickStructure.findIndex(
      (brick) => brick.id === brickField.id
    );
    if (brickStructureIndex === -1) {
      brickStructure.push({
        id: brickField.id,
        key: brickField.brick_key,
        order: brickField.brick_order,
        fields: [],
      });
    }
  });

  return brickStructure;
};

// -------------------------------------------
// Format response
const formatResponse = (brickFields: BrickFieldsT[]) => {
  // Get all config
  const builderInstances = BrickConfig.getBrickConfig();
  if (!builderInstances) return [];

  // Build the base brick structure
  const brickStructure = buildBrickStructure(brickFields);
  // Build the field tree
  brickStructure.forEach((brick) => {
    // find brick instance
    const instance = builderInstances.find((b) => b.key === brick.key);
    if (!instance) return;

    // Build the field tree
    brick.fields = buildFieldTree(brick.id, brickFields, instance);
  });

  return brickStructure;
};

export default formatResponse;
