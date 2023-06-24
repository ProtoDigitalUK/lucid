"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BrickConfig_1 = __importDefault(require("../../db/models/BrickConfig"));
const Environment_1 = __importDefault(require("../../db/models/Environment"));
const specificFieldValues = (type, builderField, field) => {
    let value = null;
    let meta = null;
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
            value = null;
            break;
        }
        case "file": {
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
const buildFieldTree = (brickId, fields, builderInstance) => {
    const brickFields = fields.filter((field) => field.collection_brick_id === brickId);
    const basicFieldTree = builderInstance.basicFieldTree;
    const buildFields = (fields) => {
        const fieldObjs = [];
        fields.forEach((field) => {
            const brickField = brickFields.find((bField) => bField.key === field.key);
            const { value, meta } = specificFieldValues(field.type, field, brickField);
            if (!brickField) {
                const fieldObj = {
                    fields_id: -1,
                    key: field.key,
                    type: field.type,
                };
                if (value !== null)
                    fieldObj.value = value;
                if (meta !== null)
                    fieldObj.meta = meta;
                fieldObjs.push(fieldObj);
            }
            else {
                if (field.type === "repeater") {
                    fieldObjs.push({
                        fields_id: brickField.fields_id,
                        key: brickField.key,
                        type: brickField.type,
                        items: buildFields(field.fields || []),
                    });
                }
                else {
                    const fieldObj = {
                        fields_id: brickField.fields_id,
                        key: brickField.key,
                        type: brickField.type,
                    };
                    if (value !== null)
                        fieldObj.value = value;
                    if (meta !== null)
                        fieldObj.meta = meta;
                    fieldObjs.push(fieldObj);
                }
            }
        });
        return fieldObjs;
    };
    const fieldRes = buildFields(basicFieldTree);
    return fieldRes;
};
const buildBrickStructure = (brickFields) => {
    const brickStructure = [];
    brickFields.forEach((brickField) => {
        const brickStructureIndex = brickStructure.findIndex((brick) => brick.id === brickField.id);
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
const formatBricks = async (brick_fields, environment_key, collection) => {
    const builderInstances = BrickConfig_1.default.getBrickConfig();
    if (!builderInstances)
        return [];
    const environment = await Environment_1.default.getSingle(environment_key);
    if (!environment)
        return [];
    const brickStructure = buildBrickStructure(brick_fields).filter((brick) => {
        const allowed = BrickConfig_1.default.isBrickAllowed(brick.key, {
            environment,
            collection,
        }, brick.type);
        return allowed.allowed;
    });
    brickStructure.forEach((brick) => {
        const instance = builderInstances.find((b) => b.key === brick.key);
        if (!instance)
            return;
        brick.fields = buildFieldTree(brick.id, brick_fields, instance);
    });
    return brickStructure;
};
exports.default = formatBricks;
//# sourceMappingURL=format-bricks.js.map