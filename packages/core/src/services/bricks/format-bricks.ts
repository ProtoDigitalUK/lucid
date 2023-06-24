// Models
import { BrickFieldsT, BrickT } from "@db/models/BrickData";
import BrickConfig from "@db/models/BrickConfig";
import Environment from "@db/models/Environment";
import { CollectionT } from "@db/models/Collection";
// Internal packages
import { FieldTypes, BrickBuilderT, CustomField } from "@lucid/brick-builder";

export interface BrickResponseT {
  id: BrickT["id"];
  key: BrickT["brick_key"];
  order: BrickT["brick_order"];
  type: BrickT["brick_type"];
  fields: Array<{
    fields_id: number;
    key: string;
    type: FieldTypes;
    value?: any;
    meta?: {
      target?: "_blank" | "_self";
      title?: string;
      slug?: string;
    };
    items?: Array<BrickResponseT["fields"][0]>;
  }>;
}

// -------------------------------------------
// Custom Field Specific Fields
const specificFieldValues = (
  type: FieldTypes,
  builderField: CustomField,
  field?: BrickFieldsT
) => {
  let value: BrickResponseT["fields"][0]["value"] = null;
  let meta: BrickResponseT["fields"][0]["meta"] | null = null;

  switch (type) {
    case "tab": {
      break;
    }
    case "text": {
      value = field?.text_value || builderField.default || "";
      break;
    }
    case "wysiwyg": {
      value = field?.text_value || builderField.default || "";
      break;
    }
    case "image": {
      // TODO: return to this once image fields are implemented
      value = null;
      break;
    }
    case "file": {
      // TODO: return to this once file fields are implemented
      value = null;
      break;
    }
    case "number": {
      value = field?.int_value || builderField.default || 0;
      break;
    }
    case "checkbox": {
      value = field?.bool_value || builderField.default || false;
      break;
    }
    case "select": {
      value =
        field?.text_value ||
        builderField.default ||
        builderField.options?.[0] ||
        "";
      break;
    }
    case "textarea": {
      value = field?.text_value || builderField.default || "";
      break;
    }
    case "json": {
      value = field?.json_value || builderField.default || {};
      break;
    }
    case "colour": {
      value = field?.text_value || builderField.default || "";
      break;
    }
    case "datetime": {
      value = field?.text_value || builderField.default || "";
      break;
    }
    case "pagelink": {
      value = field?.linked_page_full_slug || "";
      meta = {
        target: field?.json_value.target || "_self",
        title: field?.linked_page_title || "",
        slug: field?.linked_page_slug || "",
      };
      break;
    }
    case "link": {
      value = field?.text_value || builderField.default || "";
      meta = {
        target: field?.json_value.target || "_self",
      };
      break;
    }
  }

  return { value, meta };
};

// -------------------------------------------
// Build field tree
const buildFieldTree = (
  brickId: number,
  fields: BrickFieldsT[],
  builderInstance: BrickBuilderT
): BrickResponseT["fields"] => {
  // filter out the fields specific to this brick
  const brickFields = fields.filter(
    (field) => field.collection_brick_id === brickId
  );
  const basicFieldTree = builderInstance.basicFieldTree;

  const buildFields = (fields: CustomField[]): BrickResponseT["fields"] => {
    const fieldObjs: BrickResponseT["fields"] = [];
    fields.forEach((field) => {
      // find the corresponding field in our brick fields
      const brickField = brickFields.find((bField) => bField.key === field.key);

      const { value, meta } = specificFieldValues(
        field.type,
        field,
        brickField
      );

      // if a field doesn't exist in the brick fields, use the default value from the instance
      if (!brickField) {
        const fieldObj: BrickResponseT["fields"][0] = {
          fields_id: -1, // use a sentinel value for non-existing fields
          key: field.key,
          type: field.type as FieldTypes,
        };
        if (value !== null) fieldObj.value = value;
        if (meta !== null) fieldObj.meta = meta;
        fieldObjs.push(fieldObj);
      } else {
        // if the field is a repeater, call buildFieldTree recursively on its fields
        if (field.type === "repeater") {
          fieldObjs.push({
            fields_id: brickField.fields_id,
            key: brickField.key,
            type: brickField.type,
            items: buildFields(field.fields || []),
          });
        } else {
          // add the field to the response
          const fieldObj: BrickResponseT["fields"][0] = {
            fields_id: brickField.fields_id,
            key: brickField.key,
            type: brickField.type,
          };
          if (value !== null) fieldObj.value = value;
          if (meta !== null) fieldObj.meta = meta;
          fieldObjs.push(fieldObj);
        }
      }
    });
    return fieldObjs;
  };
  const fieldRes = buildFields(basicFieldTree);
  return fieldRes;
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
        type: brickField.brick_type,
        fields: [],
      });
    }
  });

  return brickStructure;
};

// -------------------------------------------
// Format response
const formatBricks = async (
  brick_fields: BrickFieldsT[],
  environment_key: string,
  collection: CollectionT
) => {
  // Get all config
  const builderInstances = BrickConfig.getBrickConfig();
  if (!builderInstances) return [];

  const environment = await Environment.getSingle(environment_key);
  if (!environment) return [];

  // Build the base brick structure
  const brickStructure = buildBrickStructure(brick_fields).filter((brick) => {
    const allowed = BrickConfig.isBrickAllowed(
      brick.key,
      {
        environment,
        collection,
      },
      brick.type
    );
    return allowed.allowed;
  });

  // Build the field tree
  brickStructure.forEach((brick) => {
    // If the brick doesn't have a corresponding builder instance, skip it
    const instance = builderInstances.find((b) => b.key === brick.key);
    if (!instance) return;

    // Build the field tree
    brick.fields = buildFieldTree(brick.id, brick_fields, instance);
  });

  return brickStructure;
};

export default formatBricks;
