// Models
import { CollectionBrickFieldsT } from "@db/models/CollectionBrick.js";
// Builders
import {
  FieldTypes,
  BrickBuilderT,
  CustomField,
} from "@builders/brick-builder/index.js";
// Utils
import createURL from "@utils/media/create-url.js";
// Services
import brickConfigService from "@services/brick-config/index.js";
// Types
import { CollectionResT } from "@lucid/types/src/collections.js";
import { EnvironmentResT } from "@lucid/types/src/environments.js";
import {
  BrickResT,
  BrickFieldValueT,
  BrickFieldMetaT,
} from "@lucid/types/src/bricks.js";

// -------------------------------------------
// Custom Field Specific Fields
const specificFieldValues = (
  type: FieldTypes,
  collection: CollectionResT,
  builderField?: CustomField,
  field?: CollectionBrickFieldsT
) => {
  let value: BrickFieldValueT = null;
  let meta: BrickFieldMetaT = null;

  switch (type) {
    case "tab": {
      break;
    }
    case "text": {
      value = field?.text_value || builderField?.default;
      break;
    }
    case "wysiwyg": {
      value = field?.text_value || builderField?.default;
      break;
    }
    case "media": {
      value = field?.media_id || undefined;
      meta = {
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
      value = field?.int_value || builderField?.default;
      break;
    }
    case "checkbox": {
      value = field?.bool_value || builderField?.default;
      break;
    }
    case "select": {
      value = field?.text_value || builderField?.default;
      break;
    }
    case "textarea": {
      value = field?.text_value || builderField?.default;
      break;
    }
    case "json": {
      value = field?.json_value || builderField?.default;
      break;
    }
    case "colour": {
      value = field?.text_value || builderField?.default;
      break;
    }
    case "datetime": {
      value = field?.text_value || builderField?.default;
      break;
    }
    case "pagelink": {
      value = {
        id: field?.page_link_id || undefined,
        target: field?.json_value.target || "_self",
        label: field?.json_value.label || field?.linked_page.title || undefined,
      };
      meta = {
        slug: field?.linked_page.slug || undefined,
      };
      break;
    }
    case "link": {
      value = {
        url: field?.text_value || builderField?.default || "",
        target: field?.json_value.target || "_self",
        label: field?.json_value.label || undefined,
      };
      break;
    }
  }

  return { value, meta };
};

// -------------------------------------------
// Format fields
const formatFields = ({
  brickFields,
  builderInstance,
  collection,
}: {
  brickFields: CollectionBrickFieldsT[];
  builderInstance?: BrickBuilderT;
  collection: CollectionResT;
}): BrickResT["fields"] => {
  const fieldObjs: BrickResT["fields"] = [];

  const fields = builderInstance?.flatFields;
  if (!fields) return fieldObjs;

  fields.forEach((field) => {
    const matchingBrickFields = brickFields.filter(
      (bField) => bField.key === field.key
    );

    matchingBrickFields.forEach((brickField) => {
      const { value, meta } = specificFieldValues(
        field.type,
        collection,
        field,
        brickField
      );

      if (brickField.type === "tab") return;
      if (brickField.type === "repeater") return;

      if (brickField) {
        let fieldsData: BrickResT["fields"][0] = {
          fields_id: brickField.fields_id,
          key: brickField.key,
          type: brickField.type,
        };
        if (brickField.group_id) fieldsData.group_id = brickField.group_id;
        if (meta) fieldsData.meta = meta;
        if (value) fieldsData.value = value;

        fieldObjs.push(fieldsData);
      }
    });
  });

  return fieldObjs;
};

const formatGroups = ({
  brickFields,
}: {
  brickFields: CollectionBrickFieldsT[];
}): BrickResT["groups"] => {
  const groups: Map<number, BrickResT["groups"][0]> = new Map();

  brickFields.forEach((brickField) => {
    if (brickField.group_id) {
      const group = groups.get(brickField.group_id);
      if (!group) {
        groups.set(brickField.group_id, {
          group_id: brickField.group_id,
          group_order: brickField.group_order,
          repeater_key: brickField.repeater_key,
          parent_group_id: brickField.parent_group_id,
        });
      }
    }
  });

  return [...groups.values()];
};

// -------------------------------------------
// Build out base brick structure
const buildBrickStructure = (brickFields: CollectionBrickFieldsT[]) => {
  const brickStructure: BrickResT[] = [];

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
        groups: [],
      });
    }
  });

  return brickStructure;
};

// -------------------------------------------
// Format response
const formatBricks = (data: {
  brick_fields: CollectionBrickFieldsT[];
  environment_key: string;
  collection: CollectionResT;
  environment: EnvironmentResT;
}): BrickResT[] => {
  // Get all config
  const builderInstances = brickConfigService.getBrickConfig();
  if (!builderInstances) return [];
  if (!data.environment) return [];

  // Build the base brick structure
  return buildBrickStructure(data.brick_fields)
    .filter((brick) => {
      const allowed = brickConfigService.isBrickAllowed({
        key: brick.key,
        type: brick.type,
        environment: data.environment,
        collection: data.collection,
      });
      return allowed.allowed;
    })
    .map((brick) => {
      const instance = builderInstances.find((b) => b.key === brick.key);
      const brickFields =
        data.brick_fields.filter(
          (field) => field.collection_brick_id === brick.id
        ) || [];

      return {
        ...brick,
        fields: formatFields({
          brickFields: brickFields,
          builderInstance: instance,
          collection: data.collection,
        }),
        groups: formatGroups({
          brickFields: brickFields,
        }),
      };
    });
};

export default formatBricks;
