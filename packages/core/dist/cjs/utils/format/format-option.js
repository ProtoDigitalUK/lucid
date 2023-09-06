"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatOptions = (options) => {
    const formattedOptions = {};
    options.forEach((option) => {
        formattedOptions[option.option_name] = option.option_value;
    });
    return formattedOptions;
};
exports.default = formatOptions;
//# sourceMappingURL=format-option.js.map