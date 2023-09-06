// Utils
import { queryDataFormat } from "@utils/app/query-helpers.js";
// Models
import { BrickFieldObject } from "@db/models/CollectionBrick.js";

export interface ServiceData {
  brick_id: number;
  data: BrickFieldObject;
  mode: "create" | "update";
}

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

const generateFieldQuery = (data: ServiceData) => {
  const brickField = data.data;

  switch (brickField.type) {
    case "link": {
      if (data.mode === "create") {
        return queryDataFormat({
          columns: [
            "collection_brick_id",
            "key",
            "type",
            "text_value",
            "json_value",
            "parent_repeater",
            "group_position",
          ],
          values: [
            data.brick_id,
            brickField.key,
            brickField.type,
            brickField.value,
            {
              target: brickField.target,
            },
            brickField.parent_repeater,
            brickField.group_position,
          ],
        });
      } else {
        return queryDataFormat({
          columns: ["text_value", "json_value", "group_position"],
          values: [
            brickField.value,
            {
              target: brickField.target,
            },
            brickField.group_position,
          ],
        });
      }
    }
    case "pagelink": {
      if (data.mode === "create") {
        return queryDataFormat({
          columns: [
            "collection_brick_id",
            "key",
            "type",
            "page_link_id",
            "json_value",
            "parent_repeater",
            "group_position",
          ],
          values: [
            data.brick_id,
            brickField.key,
            brickField.type,
            brickField.value,
            {
              target: brickField.target,
            },
            brickField.parent_repeater,
            brickField.group_position,
          ],
        });
      } else {
        return queryDataFormat({
          columns: ["page_link_id", "json_value", "group_position"],
          values: [
            brickField.value,
            {
              target: brickField.target,
            },
            brickField.group_position,
          ],
        });
      }
    }
    default: {
      if (data.mode === "create") {
        return queryDataFormat({
          columns: [
            "collection_brick_id",
            "key",
            "type",
            valueKey(brickField.type),
            "parent_repeater",
            "group_position",
          ],
          values: [
            data.brick_id,
            brickField.key,
            brickField.type,
            brickField.value,
            brickField.parent_repeater,
            brickField.group_position,
          ],
        });
      } else {
        return queryDataFormat({
          columns: [valueKey(brickField.type), "group_position"],
          values: [brickField.value, brickField.group_position],
        });
      }
    }
  }
};

export default generateFieldQuery;
