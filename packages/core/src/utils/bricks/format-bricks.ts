// Models
import {
  CollectionBrickFieldsT,
  CollectionBrickT,
} from "@db/models/CollectionBrick";
import BrickConfig from "@db/models/BrickConfig";
import Environment from "@db/models/Environment";
import { CollectionT } from "@db/models/Collection";
// Internal packages
import { FieldTypes, BrickBuilderT, CustomField } from "@lucid/brick-builder";
// Utils
import createURL from "@utils/media/create-url";

export interface BrickResponseT {
  id: CollectionBrickT["id"];
  key: CollectionBrickT["brick_key"];
  order: CollectionBrickT["brick_order"];
  type: CollectionBrickT["brick_type"];
  fields: Array<{
    fields_id: number;
    key: string;
    type: FieldTypes;
    value?:
      | string
      | number
      | boolean
      | null
      | LinkValueT
      | MediaValueT
      | PageLinkValueT;
    items?: Array<Array<BrickResponseT["fields"][0]>>;
  }>;
}

interface PageLinkValueT {
  id: number;
  target?: "_blank" | "_self";
  title?: string;
  slug?: string;
  full_slug?: string;
}

interface LinkValueT {
  target?: "_blank" | "_self";
  url?: string;
}

interface MediaValueT {
  id: number;
  url?: string;
  key?: string;
  mime_type?: string;
  file_extension?: string;
  file_size?: number;
  width?: number;
  height?: number;
  name?: string;
  alt?: string;
}

// -------------------------------------------
// Custom Field Specific Fields
const specificFieldValues = (
  type: FieldTypes,
  builderField: CustomField,
  field?: CollectionBrickFieldsT
) => {
  let value: BrickResponseT["fields"][0]["value"] = null;

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
    case "media": {
      value = {
        id: field?.media_id || undefined,
        url: createURL(field?.media.key || undefined),
        key: field?.media.key || undefined,
        mime_type: field?.media.mime_type || undefined,
        file_extension: field?.media.file_extension || undefined,
        file_size: field?.media.file_size || undefined,
        width: field?.media.width || undefined,
        height: field?.media.height || undefined,
        name: field?.media.name || undefined,
        alt: field?.media.alt || undefined,
      };
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
      value = field?.text_value || builderField.default || "";
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
      value = {
        id: field?.page_link_id || undefined,
        target: field?.json_value.target || "_self",
        title: field?.linked_page.title || undefined,
        full_slug: field?.linked_page.full_slug || undefined,
        slug: field?.linked_page.slug || undefined,
      };
      break;
    }
    case "link": {
      value = {
        target: field?.json_value.target || "_self",
        url: field?.text_value || (builderField.default as string) || "",
      };
      break;
    }
  }

  return { value };
};

// -------------------------------------------
// Build field tree
const buildFieldTree = (
  brickId: number,
  fields: CollectionBrickFieldsT[],
  builderInstance: BrickBuilderT
): BrickResponseT["fields"] => {
  // filter out the fields specific to this brick
  const brickFields = fields.filter(
    (field) => field.collection_brick_id === brickId
  );
  const basicFieldTree = builderInstance.basicFieldTree;

  const fieldRes = buildFields(brickFields, basicFieldTree);
  return fieldRes;
};

const buildFields = (
  brickFields: CollectionBrickFieldsT[],
  fields: CustomField[]
): BrickResponseT["fields"] => {
  const fieldObjs: BrickResponseT["fields"] = [];
  fields.forEach((field) => {
    // find the corresponding field in our brick fields
    const brickField = brickFields.find((bField) => bField.key === field.key);

    const { value } = specificFieldValues(field.type, field, brickField);

    // if a field doesn't exist in the brick fields, use the default value from the instance
    if (!brickField) {
      const fieldObj: BrickResponseT["fields"][0] = {
        fields_id: -1, // use a sentinel value for non-existing fields
        key: field.key,
        type: field.type as FieldTypes,
      };
      if (value !== null) fieldObj.value = value;
      fieldObjs.push(fieldObj);
    } else {
      // if the field is a repeater, call buildFieldTree recursively on its fields
      if (field.type === "repeater") {
        fieldObjs.push({
          fields_id: brickField.fields_id,
          key: brickField.key,
          type: brickField.type,
          items: buildFieldGroups(brickFields, field.fields || []),
        });
      } else {
        // add the field to the response
        const fieldObj: BrickResponseT["fields"][0] = {
          fields_id: brickField.fields_id,
          key: brickField.key,
          type: brickField.type,
        };
        if (value !== null) fieldObj.value = value;
        fieldObjs.push(fieldObj);
      }
    }
  });
  return fieldObjs;
};

// Determine max groups in repeater
const buildFieldGroups = (
  data: CollectionBrickFieldsT[],
  fields: CustomField[]
) => {
  // Group data by group_position
  const groupMap = new Map<number | null, CollectionBrickFieldsT[]>();
  let maxGroupPosition = 0;

  for (const datum of data) {
    if (datum.group_position !== null) {
      const group = groupMap.get(datum.group_position) || [];
      group.push(datum);
      groupMap.set(datum.group_position, group);
      maxGroupPosition = Math.max(maxGroupPosition, datum.group_position);
    }
  }

  // Convert each group to the desired output format
  const output: BrickResponseT["fields"][0]["items"] = [];
  for (let i = 1; i <= maxGroupPosition; i++) {
    const group = groupMap.get(i) || [];
    const outputGroup = buildFields(group, fields);
    output.push(outputGroup);
  }

  // Handle data without a group_position
  const grouplessData = groupMap.get(null) || [];
  if (grouplessData.length > 0) {
    const lastGroup = output[output.length - 1];
    lastGroup.push(...buildFields(grouplessData, fields));
  }

  return output;
};

// -------------------------------------------
// Build out base brick structure
const buildBrickStructure = (brickFields: CollectionBrickFieldsT[]) => {
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
const formatBricks = async (data: {
  brick_fields: CollectionBrickFieldsT[];
  environment_key: string;
  collection: CollectionT;
}) => {
  // Get all config
  const builderInstances = BrickConfig.getBrickConfig();
  if (!builderInstances) return [];

  const environment = await Environment.getSingle(data.environment_key);
  if (!environment) return [];

  // Build the base brick structure
  const brickStructure = buildBrickStructure(data.brick_fields).filter(
    (brick) => {
      const allowed = BrickConfig.isBrickAllowed({
        key: brick.key,
        type: brick.type,
        environment,
        collection: data.collection,
      });
      return allowed.allowed;
    }
  );

  // Build the field tree
  brickStructure.forEach((brick) => {
    // If the brick doesn't have a corresponding builder instance, skip it
    const instance = builderInstances.find((b) => b.key === brick.key);
    if (!instance) return;

    // Build the field tree
    brick.fields = buildFieldTree(brick.id, data.brick_fields, instance);
  });

  return brickStructure;
};

export default formatBricks;
