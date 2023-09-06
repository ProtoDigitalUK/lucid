import Config from "../../services/Config.js";
const createURL = (key) => {
    if (!key) {
        return undefined;
    }
    return `${Config.host}/cdn/v1/${key}`;
};
export default createURL;
//# sourceMappingURL=create-url.js.map