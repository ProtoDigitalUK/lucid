// Models
import {
  BrickFieldObject,
  BrickObject,
  BrickFieldUpdateObject,
} from "@db/models/CollectionBrick.js";
// Types
import { PageLinkValueT, LinkValueT } from "@lucid/types/src/bricks.js";

const valueKey = (type: BrickFieldObject["type"]) => {
  switch (type) {
    case "text":
      return "text_value";
    case "wysiwyg":
      return "text_value";
    case "media":
      return "media_id";
    case "number":
      return "int_value";
    case "checkbox":
      return "bool_value";
    case "select":
      return "text_value";
    case "textarea":
      return "text_value";
    case "json":
      return "json_value";
    case "pagelink":
      return "page_link_id";
    case "link":
      return "text_value";
    case "datetime":
      return "text_value";
    case "colour":
      return "text_value";
    default:
      return "text_value";
  }
};

const fieldTypeValues = (field: BrickFieldObject) => {
  switch (field.type) {
    case "link": {
      const value = field.value as LinkValueT;
      return {
        text_value: value.url,
        json_value: {
          target: value.target,
          label: value.label,
        },
      };
    }
    case "pagelink": {
      const value = field.value as PageLinkValueT;
      return {
        page_link_id: value.id,
        json_value: {
          target: value.target,
          label: value.label,
        },
      };
    }
    default: {
      return {
        [valueKey(field.type)]: field.value,
      };
    }
  }
};

const formatUpsertFields = (
  brick: BrickObject
): Array<BrickFieldUpdateObject> => {
  return (
    brick.fields?.map((field) => {
      return {
        fields_id: field.fields_id,
        collection_brick_id: brick.id as number,
        key: field.key,
        type: field.type,
        group_id: field.group_id,

        text_value: null,
        int_value: null,
        bool_value: null,
        json_value: null,
        page_link_id: null,
        media_id: null,
        ...fieldTypeValues(field),
      };
    }) || []
  );
};

export default formatUpsertFields;
