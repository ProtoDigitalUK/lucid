const formatOptions = (options) => {
    const formattedOptions = {};
    options.forEach((option) => {
        formattedOptions[option.option_name] = option.option_value;
    });
    return formattedOptions;
};
export default formatOptions;
//# sourceMappingURL=format-option.js.map