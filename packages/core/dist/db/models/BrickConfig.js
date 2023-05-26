"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const fuse_js_1 = __importDefault(require("fuse.js"));
const error_handler_1 = require("../../utils/error-handler");
class BrickConfig {
}
_a = BrickConfig;
BrickConfig.getSingle = async (req, key) => {
    const brickInstance = BrickConfig.getBrickConfig(req);
    if (!brickInstance) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Brick not found",
            message: "We could not find the brick you are looking for.",
            status: 404,
        });
    }
    const brick = brickInstance.find((b) => b.key === key);
    if (!brick) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Brick not found",
            message: "We could not find the brick you are looking for.",
            status: 404,
        });
    }
    const brickData = BrickConfig.getBrickData(brick);
    return brickData;
};
BrickConfig.getAll = async (req, query) => {
    const brickInstance = BrickConfig.getBrickConfig(req);
    if (!brickInstance)
        return [];
    const bricks = await Promise.all(brickInstance.map((brick) => BrickConfig.getBrickData(brick, query)));
    const filteredBricks = BrickConfig.filterBricks(query.filter, bricks);
    const sortedBricks = BrickConfig.sortBricks(query.sort, filteredBricks);
    return sortedBricks;
};
BrickConfig.validData = async (req, data) => {
    const brickInstances = BrickConfig.getBrickConfig(req);
    if (!brickInstances) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Brick not found",
            message: "We could not find the brick you are looking for.",
            status: 404,
        });
    }
    const brickInst = brickInstances.find((b) => b.key === data.key);
    if (!brickInst) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Brick not found",
            message: "We could not find the brick you are looking for.",
            status: 404,
        });
    }
    const validatedData = brickInst.validateBrickData(data);
    return validatedData;
};
BrickConfig.getBrickConfig = (req) => {
    const brickInstances = req.app.get("bricks");
    if (!brickInstances) {
        return [];
    }
    else {
        return brickInstances;
    }
};
BrickConfig.getBrickData = (instance, query) => {
    const data = {
        key: instance.key,
        title: instance.title,
    };
    if (!query)
        return data;
    if (query.include?.includes("fields"))
        data.fields = instance.fieldTree;
    return data;
};
BrickConfig.searcBricks = (query, bricks) => {
    if (!query)
        return bricks;
    const fuse = new fuse_js_1.default(bricks, {
        keys: ["title"],
        threshold: 0.3,
    });
    const searchResults = fuse.search(query);
    return searchResults.map((r) => r.item);
};
BrickConfig.filterBricks = (filter, bricks) => {
    if (!filter)
        return bricks;
    let filteredBricks = [...bricks];
    Object.keys(filter).forEach((f) => {
        switch (f) {
            case "s":
                const searchQuery = filter[f];
                if (searchQuery)
                    filteredBricks = BrickConfig.searcBricks(searchQuery, filteredBricks);
                break;
            default:
                break;
        }
    });
    return filteredBricks;
};
BrickConfig.sortBricks = (sort, bricks) => {
    if (!sort)
        return bricks;
    let sortedBricks = [...bricks];
    sort.forEach((s) => {
        sortedBricks = sortedBricks.sort((a, b) => {
            switch (s.key) {
                case "name":
                    if (s.value === "asc") {
                        return a.title.localeCompare(b.title);
                    }
                    else {
                        return b.title.localeCompare(a.title);
                    }
                default:
                    return 0;
            }
        });
    });
    return sortedBricks;
};
exports.default = BrickConfig;
//# sourceMappingURL=BrickConfig.js.map