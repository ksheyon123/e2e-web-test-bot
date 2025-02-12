"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const express_1 = __importDefault(require("express"));
const puppeteer_2 = require("../utils/puppeteer");
const index_1 = require("../utils/index");
const fs_1 = require("../utils/fs");
const langchain_1 = require("../utils/langchain");
const prompt_1 = require("../prompt/prompt");
const router = express_1.default.Router();
let page = null;
let hash = null;
let actions = null;
// Puppeteer 자동화 API 엔드포인트
router.get("/launch", async (req, res) => {
    try {
        const { url } = req.query;
        const browser = await puppeteer_1.default.launch({
            headless: false,
            defaultViewport: {
                width: 1920,
                height: 1080,
            },
        });
        page = await browser.newPage();
        page.setDefaultNavigationTimeout(30000);
        page.setDefaultTimeout(30000);
        if (page && typeof url === "string") {
            await (0, puppeteer_2.goToPage)(page, url);
            await (0, puppeteer_2.createGridOverlay)(page);
        }
        res.json({ success: true });
    }
    catch (e) {
        console.error("자동화 에러:", e);
        res.status(500).json({ success: false, error: e.message });
    }
});
router.get("/screenshot", async (_req, res) => {
    try {
        hash = (0, index_1.createHash)();
        if (hash && page) {
            await (0, fs_1.setScreenshots)(hash);
            console.log("초기 화면 스크린샷...");
            await (0, puppeteer_2.getScreenshot)(page, hash);
            res.json({ success: true });
        }
        else {
            throw new Error("Page or hash not initialized");
        }
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});
router.get("/features", async (_req, res) => {
    try {
        if (!hash) {
            throw new Error("Hash not initialized");
        }
        const imageBuffer = await (0, fs_1.getScreenshots)(hash, "default_screen.png");
        // 2. buffer를 base64로 변환
        const base64Image = imageBuffer.toString("base64");
        const query = `${prompt_1.humanPrompt_new}`;
        const chain = (0, langchain_1.createModel)();
        const prompt = await (0, langchain_1.createPrompt)();
        const response = await (0, langchain_1.requestAnswer)(prompt, chain, query, base64Image);
        actions = { ...response };
        res.json({ success: true, data: response });
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});
router.get("/move", async (_req, res) => {
    if (page) {
        await (0, puppeteer_2.mouseMove)(page, { x: 960, y: 621 }, { width: 10, height: 20 });
    }
    res.json({ success: true });
});
router.get("/click", async (_req, res) => {
    if (page) {
        await (0, puppeteer_2.mouseClick)(page, { x: 960, y: 621 });
    }
    res.json({ success: true });
});
router.get("/test", async (req, res) => {
    try {
        const { idx } = req.query;
        if (!actions || !page || typeof idx !== "string") {
            throw new Error("Required data not initialized");
        }
        const { elements } = actions;
        const coord = elements[Number(idx)].pixelCoord;
        const size = elements[Number(idx)].size;
        console.log(coord);
        await (0, puppeteer_2.mouseMove)(page, coord, size);
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});
exports.default = router;
