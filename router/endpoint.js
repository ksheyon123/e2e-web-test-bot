const puppeteer = require("puppeteer");
const express = require("express");
const router = express.Router();

const {
  runAutomation,
  setCriterion,
  goToPage,
  getScreenshot,
  mouseMove,
  mouseClick,
  createGridOverlay,
} = require("../utils/puppeteer");
const { createHash } = require("../utils/index");
const { setScreenshots, getScreenshots } = require("../utils/fs");
const {
  createModel,
  createPrompt,
  requestAnswer,
} = require("../utils/langchain");
const { humanPrompt_new } = require("../prompt/prompt");

let page = null;
let hash = null;

// Puppeteer 자동화 API 엔드포인트
router.get("/launch", async (req, res) => {
  try {
    const { url } = req.query;
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
    });
    page = await browser.newPage();
    page.setDefaultNavigationTimeout(30000);
    page.setDefaultTimeout(30000);
    await goToPage(page, url);
    await createGridOverlay(page);
    res.json({ success: true });
  } catch (e) {
    console.error("자동화 에러:", e);
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get("/screenshot", async (req, res) => {
  try {
    hash = createHash();
    await setScreenshots(hash);
    console.log("초기 화면 스크린샷...");
    await getScreenshot(page, hash);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

let actions = null;

router.get("/features", async (req, res) => {
  try {
    const imageBuffer = await getScreenshots(hash, "default_screen.png");
    // 2. buffer를 base64로 변환
    const base64Image = imageBuffer.toString("base64");
    const query = `${humanPrompt_new}`;
    const chain = createModel();
    const prompt = await createPrompt();
    const response = await requestAnswer(prompt, chain, query, base64Image);
    actions = { ...response };
    res.json({ success: true, data: response });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get("/move", async (req, res) => {
  await mouseMove(page, { x: 960, y: 621 }, { width: 10, height: 20 });
});

router.get("/click", async (req, res) => {
  await mouseClick(page, { x: 960, y: 621 });
});

router.get("/test", async (req, res) => {
  try {
    const { idx } = req.query;
    const { elements } = actions;
    const coord = elements[Number(idx)].pixelCoord;
    const size = elements[Number(idx)].size;
    console.log(coord);
    await mouseMove(page, coord, size);

    res.json({ success: true });
  } catch (e) {
    throw e;
  }
});

module.exports = router;
