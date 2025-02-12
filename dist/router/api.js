"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post("/submit", async (req, res) => {
    try {
        console.log(req.body);
        res.status(200).json({});
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});
exports.default = router;
