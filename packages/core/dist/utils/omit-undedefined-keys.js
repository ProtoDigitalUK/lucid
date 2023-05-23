"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const omitUndefinedKeys = (obj) => {
    const newObj = {};
    for (const key in obj) {
        if (obj[key] !== undefined) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
};
exports.default = omitUndefinedKeys;
//# sourceMappingURL=omit-undedefined-keys.js.map