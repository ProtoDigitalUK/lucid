import Config from "../Config.js";
const getBrickConfig = () => {
    const brickInstances = Config.bricks;
    if (!brickInstances) {
        return [];
    }
    else {
        return brickInstances;
    }
};
export default getBrickConfig;
//# sourceMappingURL=get-brick-config.js.map