"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const getAuthenticatedUser = router.get("/me", (req, res) => {
    res.status(200).json({
        name: "John Doeing",
        email: "johndoe@example.com",
        role: "admin",
    });
});
router.use("/auth", [getAuthenticatedUser]);
exports.default = router;
//# sourceMappingURL=auth.js.map