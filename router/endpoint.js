const puppeteer = require("puppeteer");
const express = require("express");
const router = express.Router();

const { runAutomation } = require("../utils/puppeteer");

// Puppeteer 자동화 API 엔드포인트
router.get("/", async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const results = await runAutomation(browser);
    res.json({ success: true, results });
  } catch (error) {
    console.error("자동화 에러:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/functions", async (req, res) => {
  try {
  } catch (e) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
