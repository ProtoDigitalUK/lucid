"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const overview = router.get("/", (req, res) => {
    res.status(200).json({
        ping: {
            api: 100,
            db: 200,
        },
        uptime: 100,
        status: "ok",
    });
});
const ping = router.get("/ping", (req, res) => {
    res.status(200).json({
        ping: {
            api: 100,
            db: 200,
        },
    });
});
router.use("/health", [overview, ping]);
exports.default = router;
//# sourceMappingURL=health.js.map