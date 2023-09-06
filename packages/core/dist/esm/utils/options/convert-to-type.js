const convertToType = (option) => {
    switch (option.type) {
        case "boolean":
            option.option_value = option.option_value === "true" ? true : false;
            break;
        case "number":
            option.option_value = parseInt(option.option_value);
            break;
        case "json":
            option.option_value = JSON.parse(option.option_value);
            break;
        default:
            option.option_value;
            break;
    }
    return option;
};
export default convertToType;
//# sourceMappingURL=convert-to-type.js.map