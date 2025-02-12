import puppeteer, { Browser, Page } from "puppeteer";
import express, { Router, Request, Response } from "express";
import {
  runAutomation,
  goToPage,
  getScreenshot,
  mouseMove,
  mouseClick,
  createGridOverlay,
} from "../utils/puppeteer";
import { createHash } from "../utils/index";
import { setScreenshots, getScreenshots } from "../utils/fs";
import {
  createModel,
  createPrompt,
  createChain,
  requestAnswer,
} from "../utils/langchain";
import { humanPrompt_new } from "../prompt/prompt";
import { AnswerElement } from "types/langchain.type";

interface Coordinate {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface Element {
  pixelCoord: Coordinate;
  size: Size;
}

interface Actions {
  elements: Element[];
  [key: string]: any;
}

const router: Router = express.Router();

let page: Page | null = null;
let hash: string | null = null;
let actions: Actions | null = null;

// Puppeteer 자동화 API 엔드포인트
router.get("/launch", async (req: Request, res: Response) => {
  try {
    const { url } = req.query;
    const browser: Browser = await puppeteer.launch({
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
      await goToPage(page, url);
      await createGridOverlay(page);
    }
    res.json({ success: true });
  } catch (e) {
    console.error("자동화 에러:", e);
    res.status(500).json({ success: false, error: (e as Error).message });
  }
});

router.get("/screenshot", async (_req: Request, res: Response) => {
  try {
    hash = createHash();
    if (hash && page) {
      await setScreenshots(hash);
      console.log("초기 화면 스크린샷...");
      await getScreenshot(page, hash);
      res.json({ success: true });
    } else {
      throw new Error("Page or hash not initialized");
    }
  } catch (e) {
    res.status(500).json({ success: false, error: (e as Error).message });
  }
});

router.get("/features", async (_req: Request, res: Response) => {
  try {
    if (!hash) {
      throw new Error("Hash not initialized");
    }
    const imageBuffer = await getScreenshots(hash, "default_screen.png");
    // 2. buffer를 base64로 변환
    const base64Image = imageBuffer.toString("base64");
    const query = `${humanPrompt_new}`;
    const model = createModel();
    const prompt = await createPrompt();
    const chain = await createChain(prompt, model);
    const response = await requestAnswer<any>(chain, query, base64Image);
    actions = { ...response };
    res.json({ success: true, data: response });
  } catch (e) {
    res.status(500).json({ success: false, error: (e as Error).message });
  }
});

router.get("/move", async (_req: Request, res: Response) => {
  if (page) {
    await mouseMove(page, { x: 960, y: 621 }, { width: 10, height: 20 });
  }
  res.json({ success: true });
});

router.get("/click", async (_req: Request, res: Response) => {
  if (page) {
    await mouseClick(page, { x: 960, y: 621 });
  }
  res.json({ success: true });
});

router.get("/test", async (req: Request, res: Response) => {
  try {
    const { idx } = req.query;
    if (!actions || !page || typeof idx !== "string") {
      throw new Error("Required data not initialized");
    }
    const { elements } = actions;
    const coord = elements[Number(idx)].pixelCoord;
    const size = elements[Number(idx)].size;
    console.log(coord);
    await mouseMove(page, coord, size);

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: (e as Error).message });
  }
});

export default router;
