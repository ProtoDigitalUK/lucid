"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convertToString = (value, type) => {
    switch (type) {
        case "boolean":
            value = value ? "true" : "false";
            break;
        case "json":
            value = JSON.stringify(value);
            break;
        default:
            value = value.toString();
            break;
    }
    return value;
};
exports.default = convertToString;
//# sourceMappingURL=convert-to-string.js.map