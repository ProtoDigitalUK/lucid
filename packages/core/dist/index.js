"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("./routes/index"));
const start = async () => {
    const app = (0, express_1.default)();
    const server = http_1.default.createServer(app);
    app.use("/", express_1.default.static(path_1.default.join(__dirname, "../cms"), { extensions: ["html"] }));
    app.use("/api", index_1.default);
    server.listen(3000, () => {
        console.log("Server listening on port 3000");
    });
};
const exportObject = { start };
exports.default = exportObject;
//# sourceMappingURL=index.js.map