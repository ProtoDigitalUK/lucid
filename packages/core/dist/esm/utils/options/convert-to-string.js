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
export default convertToString;
//# sourceMappingURL=convert-to-string.js.map